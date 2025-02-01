import React, {useState, useRef, useEffect, useLayoutEffect} from 'react';
import gsap from 'gsap';
import {Draggable} from 'gsap/Draggable';
import {Flip} from 'gsap/Flip';
import {captureFlipState, animateFlip} from './animations/dealCards';
import {
    Card,
    Suit,
    Rank,
    TablePair,
    GameRules,
    AttackValidationContext,
    DefendValidationContext,
    SlotValidationContext, GameState,
} from '../../types/types';
import CardItem from './CardItem';
import OpponentsContainer from './OpponentsContainer';
import Player from './Player';
import styles from './styles/GameBoard.module.css';
import {getCardStyle, getTrumpCardStyle} from './position/cardPositioning';
import {TABLE_PAIRS_POSITIONS} from './position/tablePairsPositions';
import {getSuitClass, getSuitSymbol} from './utils/suitSymbols';
import {defaultAttackRules} from './rules/attackRules';
import {defaultDefendRules} from './rules/defendRules';
import {defaultSlotRules} from './rules/slotRules';
import {useParams} from "react-router";


gsap.registerPlugin(Draggable, Flip);

const suits: Suit[] = ['H', 'D', 'C', 'S'];
const ranks: Rank[] = ['6', '7', '8', '9', '10', '11', '12', '13', '14'];

/** Создаём и перемешиваем колоду */
function createAllDeck(): Card[] {
    const deck: Card[] = [];
    let idCount = 0;
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({
                id: `card_${idCount++}`,
                suit,
                rank,
                location: 'deck',
            });
        }
    }
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

interface GameBoardProps {
    numPlayers: number;
    rules?: Partial<GameRules>;
}

const GameBoard: React.FC<GameBoardProps> = ({ rules = {}}) => {
    const mergedRules: GameRules = {
        maxTablePairs: rules.maxTablePairs || 6,
        distanceThreshold: rules.distanceThreshold || 200,
        initialHandSize: 6,
        attackRules: rules.attackRules || defaultAttackRules,
        defendRules: rules.defendRules || defaultDefendRules,
        slotRules: rules.slotRules || defaultSlotRules,
    };

    const [cards, setCards] = useState<Card[]>([]);
    const [trumpSuit, setTrumpSuit] = useState<Suit | null>(null);
    const [trumpCardId, setTrumpCardId] = useState<string | null>(null);

    const [tablePairs, setTablePairs] = useState<TablePair[]>(
        Array.from({length: mergedRules.maxTablePairs}, () => ({
            attackCardId: null,
            coverCardId: null,
        }))
    );

    const [currentTurnRole, setCurrentTurnRole] = useState<'attack' | 'defend'>('attack');

    const tablePairsRef = useRef<TablePair[]>([]);
    const cardsRef = useRef<Card[]>([]);
    const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
    const newFlipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
    const gameBoardRef = useRef<HTMLDivElement>(null);
    const discardCardsRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
    const draggableRefs = useRef<Record<string, Draggable>>({});
    const roleRef = useRef<'attack' | 'defend'>('attack');
    const [socket, setSocket] = useState<WebSocket | null>(null);
    // numPlayers
    // const [gameState, setGameState] = useState<GameState>(null);

    const [numPlayers, setNumPlayers] = useState<number>(0);

    const gameState = useRef<GameState | null>(null);

    const {id: gameId} = useParams<{ id: string }>()

    useEffect(() => {

        const token = localStorage.getItem('token');
        const ws = new WebSocket(`wss://durak-back.1k.games/api/v1/game/${gameId}/ws?token=${token}`);
        if (ws) {
            setSocket(ws);
        }

        ws.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message:', data);
            // setGameState(data);
            if(!gameState.current){
                gameState.current = data as GameState;
                setNumPlayers(data.data.state.players.length);
                handleStartGame();
            }

        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        return () => {
            ws.close();
        };
    }, []);


    useEffect(() => {
        tablePairsRef.current = tablePairs;
    }, [tablePairs]);

    useEffect(() => {
        cardsRef.current = cards;
    }, [cards]);

    useEffect(() => {
        roleRef.current = currentTurnRole;
    }, [currentTurnRole]);

    useEffect(() => {
        const initialDeck = createAllDeck();
        setCards(initialDeck);
    }, []);

    useLayoutEffect(() => {
        if (flipStateRef.current) {
            animateFlip(flipStateRef.current, () => {
                flipStateRef.current = null;
            });
        }
    }, [cards]);

    const handleStartGame = () => {
        flipStateRef.current = captureFlipState();
        setCards((prev) => {
            const updated = [...prev];
            if (!updated.length) return updated;

            const lastIndex = updated.length - 1;
            const trumpCard = updated[lastIndex];
            setTrumpSuit(trumpCard.suit);
            setTrumpCardId(trumpCard.id);

            const numOpponents = numPlayers - 1;
            let deckPos = 0;
            const cardsPerPlayer = 6;

            const giveCard = (i: number, location: 'player' | 'opponent', seat?: number) => {
                updated[i].location = location;
                if (seat !== undefined) updated[i].seatIndex = seat;
            };

            for (let i = 0; i < cardsPerPlayer; i++) {
                if (deckPos >= updated.length) break;
                giveCard(deckPos++, 'player');
                for (let seat = 0; seat < numOpponents; seat++) {
                    if (deckPos >= updated.length) break;
                    giveCard(deckPos++, 'opponent', seat);
                }
            }

            return updated;
        });
    };

    const playerCards = cards.filter((c) => c.location === 'player');
    const opponentCards = cards.filter((c) => c.location === 'opponent');

    useEffect(() => {
        playerCards.forEach((card) => {
            if (draggableRefs.current[card.id]) return;

            const el = document.querySelector(`[data-flip-id="${card.id}"]`);
            if (!el) return;

            const draggable = Draggable.create(el, {
                type: 'x,y',
                onPress: () => {
                    newFlipStateRef.current = Flip.getState(el, {
                        props: 'transform, top, left, zIndex',
                    });
                },
                onDragEnd: () => {
                    flipStateRef.current = Flip.getState(el, {
                        props: 'transform, top, left, zIndex',
                    });
                    handlePlayerCardDrop(card.id, flipStateRef.current!);
                },
            })[0];

            draggableRefs.current[card.id] = draggable;
        });

        return () => {
            // Удаляем драггеры с карт, которые ушли из руки игрока
            Object.keys(draggableRefs.current).forEach((cardId) => {
                const c = cards.find((cc) => cc.id === cardId);
                if (c && c.location !== 'player') {
                    draggableRefs.current[cardId].kill();
                    delete draggableRefs.current[cardId];
                }
            });
        };
    }, [playerCards, cards]);

    // ---------------- ВАЛИДАЦИИ ----------------
    const validateAttack = (
        card: Card,
        freeIndex: number,
        cardCenter: { x: number; y: number }
    ) => {
        const attackContext: AttackValidationContext = {
            attackingCard: card,
            tableCards: cardsRef.current.filter((c) => c.location === 'table'),
            trumpSuit,
            gameRules: mergedRules,
        };

        // Позиция слота для проверки distance
        const slotPos = calculateSlotPosition(freeIndex, 'attack');
        const slotContext: SlotValidationContext = {
            cardPosition: cardCenter,
            slotPosition: slotPos,
            maxDistance: mergedRules.distanceThreshold,
        };

        return {
            attackValid: mergedRules.attackRules.every((r) => r.validator(attackContext)),
            slotValid: mergedRules.slotRules.every((r) => r.validator(slotContext)),
        };
    };

    const validateDefense = (
        defendingCard: Card,
        attackingCard: Card,
        slotIndex: number,
        cardCenter?: { x: number; y: number }
    ) => {
        const defendContext: DefendValidationContext = {
            attackingCard,
            defendingCard,
            trumpSuit,
            gameRules: mergedRules,
        };

        // Если хотим учитывать distanceThreshold в автоматическом ходе,
        // нужно передавать фиктивные координаты. Иначе можно просто игнорировать slotRules.
        let slotValid = true;
        if (cardCenter) {
            const slotPos = calculateSlotPosition(slotIndex, 'cover');
            const slotContext: SlotValidationContext = {
                cardPosition: cardCenter,
                slotPosition: slotPos,
                maxDistance: mergedRules.distanceThreshold,
            };
            slotValid = mergedRules.slotRules.every((r) => r.validator(slotContext));
        }

        // Логика, чем можно покрыть
        const defendValid = mergedRules.defendRules.every((r) => r.validator(defendContext));

        return {defendValid, slotValid};
    };

    const calculateSlotPosition = (
        index: number,
        type: 'attack' | 'cover'
    ) => {
        const {top, left} = TABLE_PAIRS_POSITIONS[index][type];
        const gameRect = gameBoardRef.current!.getBoundingClientRect();
        return {
            x: gameRect.left + (gameRect.width * left) / 100,
            y: gameRect.top + (gameRect.height * top) / 100,
        };
    };

    // ---------------- ДРОП КАРТЫ ИЗ РУКИ ИГРОКА ----------------
    function handlePlayerCardDrop(
        cardId: string,
        flipState: ReturnType<typeof Flip.getState>
    ) {
        if (!gameBoardRef.current || !newFlipStateRef.current) return;

        const el = document.querySelector(`[data-flip-id="${cardId}"]`) as HTMLElement;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const cardCenter = {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
        const actualRole = roleRef.current;
        const currentCard = cardsRef.current.find((c) => c.id === cardId);
        if (!currentCard) return;

        if (actualRole === 'attack') {
            // Ищем свободный индекс пары (где нет attackCardId)
            const freeIndex = tablePairsRef.current.findIndex((p) => p.attackCardId === null);
            if (freeIndex === -1) {
                revertCard(cardId, newFlipStateRef.current);
                return;
            }

            const {attackValid, slotValid} = validateAttack(currentCard, freeIndex, cardCenter);
            if (!attackValid || !slotValid) {
                revertCard(cardId, newFlipStateRef.current);
                return;
            }

            placeAttackCard(cardId, freeIndex, flipState);
        } else {
            // Значит мы покрываем
            let foundIndex: number | null = null;
            for (let i = 0; i < tablePairsRef.current.length; i++) {
                const pair = tablePairsRef.current[i];
                if (!pair.attackCardId || pair.coverCardId) continue;

                const slotPos = calculateSlotPosition(i, 'cover');
                const dist = Math.hypot(cardCenter.x - slotPos.x, cardCenter.y - slotPos.y);
                if (dist <= mergedRules.distanceThreshold) {
                    foundIndex = i;
                    break;
                }
            }

            if (foundIndex === null) {
                revertCard(cardId, newFlipStateRef.current);
                return;
            }

            const attackCardId = tablePairsRef.current[foundIndex].attackCardId;
            if (!attackCardId) {
                revertCard(cardId, newFlipStateRef.current);
                return;
            }
            const attackCard = cardsRef.current.find((c) => c.id === attackCardId);
            if (!attackCard) {
                revertCard(cardId, newFlipStateRef.current);
                return;
            }

            const {defendValid, slotValid} = validateDefense(currentCard, attackCard, foundIndex, cardCenter);
            if (!defendValid || !slotValid) {
                revertCard(cardId, newFlipStateRef.current);
                return;
            }

            placeCoverCard(cardId, foundIndex, flipState);
        }
    }

    // ---------------- УСТАНОВКА КАРТ НА СТОЛ ----------------
    const placeAttackCard = (
        cardId: string,
        pairIndex: number,
        flipState: ReturnType<typeof Flip.getState>
    ) => {
        setTablePairs((prev) =>
            prev.map((p, i) =>
                i === pairIndex ? {...p, attackCardId: cardId} : p
            )
        );
        setCards((prev) =>
            prev.map((c) =>
                c.id === cardId
                    ? {
                        ...c,
                        location: 'table',
                        tablePairIndex: pairIndex,
                        tableRole: 'attack',
                    }
                    : c
            )
        );
        Flip.from(flipState, {duration: 0.8, ease: 'power2.out', absolute: true, scale: true});
    };

    const placeCoverCard = (
        cardId: string,
        pairIndex: number,
        flipState: ReturnType<typeof Flip.getState>
    ) => {
        setTablePairs((prev) =>
            prev.map((p, i) =>
                i === pairIndex ? {...p, coverCardId: cardId} : p
            )
        );
        setCards((prev) =>
            prev.map((c) =>
                c.id === cardId
                    ? {
                        ...c,
                        location: 'table',
                        tablePairIndex: pairIndex,
                        tableRole: 'cover',
                    }
                    : c
            )
        );
        Flip.from(flipState, {duration: 0.8, ease: 'power2.out', absolute: true, scale: true});
    };

    const revertCard = (cardId: string, oldState: ReturnType<typeof Flip.getState>) => {
        Flip.to(oldState, {duration: 0.8, ease: 'power4.out', absolute: true, zIndex: 100});
    };

    // ---------------- ОТБОЙ / ВЗЯТЬ КАРТЫ ----------------
    const hasAtLeastOneAttack = tablePairsRef.current.some((p) => p.attackCardId !== null);
    const allAttacksCovered = tablePairsRef.current.every(
        (p) => !p.attackCardId || p.coverCardId
    );
    const isBeatVisible = hasAtLeastOneAttack && allAttacksCovered;

    const handleBeat = () => {
        // Находим все карты, которые полностью покрыты
        const coveredCardIds = tablePairsRef.current.flatMap((p) =>
            p.attackCardId && p.coverCardId ? [p.attackCardId, p.coverCardId] : []
        );

        discardCardsRef.current = Flip.getState(
            coveredCardIds
                .map((id) => document.querySelector(`[data-flip-id="${id}"]`))
                .filter(Boolean) as HTMLElement[],
            {props: 'transform, top, left, zIndex'}
        );

        setCards((prev) =>
            prev.map((c) =>
                coveredCardIds.includes(c.id) ? {...c, location: 'discard'} : c
            )
        );
        setTablePairs((prev) =>
            prev.map((p) =>
                p.attackCardId && p.coverCardId ? {attackCardId: null, coverCardId: null} : p
            )
        );
    };

    const handleDealAfterBeat = () => {
        flipStateRef.current = captureFlipState();
        setCards((prev) => {
            const updated = [...prev];
            const deckCards = updated.filter((c) => c.location === 'deck');
            let deckPos = 0;

            const refillHand = (location: 'player' | 'opponent', seat?: number) => {
                const currentCount = updated.filter(
                    (c) => c.location === location && (seat === undefined || c.seatIndex === seat)
                ).length;
                const needed = 6 - currentCount;
                for (let i = 0; i < needed && deckPos < deckCards.length; i++) {
                    deckCards[deckPos].location = location;
                    if (seat !== undefined) deckCards[deckPos].seatIndex = seat;
                    deckPos++;
                }
            };

            // Сначала игрок
            refillHand('player');
            // Затем — оппоненты
            for (let seat = 0; seat < numPlayers - 1; seat++) {
                refillHand('opponent', seat);
            }

            return updated;
        });
        setCurrentTurnRole('attack');
    };

    useLayoutEffect(() => {
        if (discardCardsRef.current) {
            Flip.from(discardCardsRef.current, {
                duration: 1,
                ease: 'power2.out',
                absolute: true,
                scale: true,
                onComplete: () => {
                    discardCardsRef.current = null;
                    handleDealAfterBeat();
                },
            });
        }
    }, [cards]);

    const handleTakeCards = () => {
        flipStateRef.current = captureFlipState();
        const tableCardIds = tablePairsRef.current.flatMap((p) =>
            [p.attackCardId, p.coverCardId].filter(Boolean) as string[]
        );

        setCards((prev) =>
            prev.map((c) =>
                tableCardIds.includes(c.id)
                    ? {
                        ...c,
                        location: 'player',
                        tablePairIndex: undefined,
                        tableRole: undefined,
                    }
                    : c
            )
        );
        setTablePairs((prev) =>
            prev.map(() => ({attackCardId: null, coverCardId: null}))
        );
    };

    const isTakeVisible = tablePairs.some((p) => p.attackCardId && !p.coverCardId);

    // ---------------- ХОД ПРОТИВНИКА ----------------
    const handleOpponentMove = () => {
        // Ищем первую непокрытую пару (attackCardId есть, coverCardId нет).
        const uncoveredIndex = tablePairs.findIndex(
            (p) => p.attackCardId && !p.coverCardId
        );
        if (uncoveredIndex === -1) {
            console.log('Нет непокрытых атак — ход противника не нужен');
            return;
        }

        const attackCardId = tablePairs[uncoveredIndex].attackCardId!;
        const attackCard = cards.find((c) => c.id === attackCardId);
        if (!attackCard) return;

        // Ищем карту среди противников, которая может покрыть attackCard
        // (упростим: берём просто карты с location === 'opponent')
        const oppCards = cards.filter((c) => c.location === 'opponent');

        // Захватываем Flip-состояние для анимации
        flipStateRef.current = captureFlipState();


        // Пытаемся найти первую карту, которая подходит по правилам
        const suitableCard = oppCards.find((defCard) => {
            // Проверяем лишь «может ли крыть», а distance не учитываем
            const {defendValid} = validateDefense(defCard, attackCard, uncoveredIndex);
            return defendValid;
        });

        if (!suitableCard) {
            console.log('Противник не смог покрыть — нет подходящей карты');
            return;
        }

        // Если нашли, кладём её на стол (как cover)
        placeCoverCard(suitableCard.id, uncoveredIndex, flipStateRef.current!);
    };


    return (
        <div className={styles.gameBoard} ref={gameBoardRef}>
            <OpponentsContainer numPlayers={numPlayers} allOpponentCards={opponentCards}/>

            <Player
                onStartGame={handleStartGame}
                cards={playerCards}
                onBeat={handleBeat}
                isBeatVisible={isBeatVisible}
                onTakeCards={handleTakeCards}
                isTakeVisible={isTakeVisible}
            />

            <div style={{position: 'absolute', top: 10, right: 10, color: 'white'}}>
                <p>Current role: {currentTurnRole}</p>
                <button onClick={() => setCurrentTurnRole('attack')}>Attack</button>
                <button onClick={() => setCurrentTurnRole('defend')}>Defend</button>
                {/* Кнопка для хода противника */}
                <button onClick={handleOpponentMove}>Ход противника</button>
            </div>

            {tablePairs.map((pair, i) => {
                const pos = TABLE_PAIRS_POSITIONS[i];
                if (!pos) return null;
                return (
                    <React.Fragment key={i}>
                        <div
                            style={{
                                position: 'absolute',
                                top: `${pos.attack.top}%`,
                                left: `${pos.attack.left}%`,
                                width: '50px',
                                height: '70px',
                                backgroundColor: pair.attackCardId ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.3)',
                                border: pair.attackCardId ? '1px dashed green' : '2px solid red',
                                pointerEvents: 'none',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: `${pos.cover.top}%`,
                                left: `${pos.cover.left}%`,
                                width: '50px',
                                height: '70px',
                                backgroundColor: pair.coverCardId ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.3)',
                                border: pair.coverCardId ? '1px dashed green' : '2px solid red',
                                pointerEvents: 'none',
                            }}
                        />
                    </React.Fragment>
                );
            })}

            {trumpSuit && (
                <div className={styles.trumpIndicator} style={{color: getSuitClass(trumpSuit)}}>
                    {getSuitSymbol(trumpSuit)}
                </div>
            )}
            <button
            onClick={() => {
                socket?.send(JSON.stringify({
                    "player_id": "1",
                    "type": "attack_pass",
                    "defending_card": null,
                    "attacking_card": null
                }));
            }}
            >
                send event
            </button>

            {cards.map((card) => {
                const style =
                    card.id === trumpCardId && card.location === 'deck'
                        ? getTrumpCardStyle()
                        : getCardStyle(card, cards, numPlayers);

                return (
                    <CardItem
                        key={card.id}
                        card={card}
                        trumpSuit={trumpSuit}
                        style={style}
                        isDraggable={card.location === 'player'}
                        isFaceUp={
                            ['player', 'table'].includes(card.location) ||
                            (card.id === trumpCardId && card.location === 'deck')
                        }
                    />
                );
            })}
        </div>
    );
};

export default GameBoard;