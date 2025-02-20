import styled from "styled-components";
import {Header} from "../components/header.tsx";
import {RangeSlider} from "../components/range-input.tsx";
import {NumberOFPlayers} from "../components/number-of-players.tsx";
import {OnlyForFiends} from "../components/only-for-friends.tsx";
import {PlusIcon} from "../components/icons/plus.tsx";
import {GameMode} from "../components/game-mode.tsx";
import {createGame, CreateGameProps, leaveGame} from "../api/requests/game.tsx";
import React from "react";

export const CreateGame = () => {
    const [form, setForm] = React.useState<CreateGameProps>({
        bet: 100,
        maxPlayers: 2,
        friendsOnly: false
    })
    const onCreateGame = async () => {
        console.log('Create game', form)
        const response = await createGame(form)
        if (response.id) {
            console.log('Game created')
        }
    }

    return (
        <Container>
            <Header name="John Doe" games={5} value={100} secondValue={200}/>
            <Title>
                Создать стол
            </Title>
            <Column>
                <RangeSlider
                    values={[form.bet]}
                    onChange={(values) => setForm({...form, bet: values[0]})}
                />
                <NumberOFPlayers
                    value={form.maxPlayers}
                    onChange={(value) => setForm({...form, maxPlayers: value})}
                />
                <GameMode/>
                <OnlyForFiends value={form.friendsOnly} onChange={(value) => setForm({...form, friendsOnly: value})}/>
            </Column>
            <Bottom>
                <BottomInner>
                    <PrimaryButton onClick={onCreateGame}>
                        <PlusIcon/>
                        Создать игру
                    </PrimaryButton>
                </BottomInner>
            </Bottom>
        </Container>
    )
}


const Title = styled.div`
    color: #FAFEFC;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding-top: 16px;
    width: 100%;
    padding-left: 16px;

`

const PrimaryButton = styled.div`
    position: relative;
    display: flex;
    height: 52px;
    width: 100%;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 46px;
    background: linear-gradient(180deg, #64CB48 0%, #53BE36 100%);
    box-shadow: 0px 2px 2px -2px #53BE36, 0px 2px 0px 0px #2A5F1B;
    min-width: 160px;
    color: #180A03;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 19.2px */
    @media (max-width: 380px) {
        font-size: 14px;
    }

    &:before {
        position: absolute;
        pointer-events: none;
        content: "";
        border-radius: 100px;
        inset: 0;
        background: linear-gradient(180deg, #A2E091 0%, rgba(162, 224, 145, 0.00) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        padding: 1px;
    }
`


const Bottom = styled.div`
    display: flex;
    width: 100%;
    padding: 8px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    position: absolute;
    bottom: 0;
`


const BottomInner = styled.div`
    display: flex;
    padding: 8px;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    border-radius: 100px;
    background: #131318;
    box-shadow: 0px 2px 0px 0px #000, 0px 0px 16px 16px #07070D;

    position: relative;

    &:before {
        position: absolute;
        pointer-events: none;
        content: "";
        border-radius: 1000px;
        inset: 0;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.00) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        padding: 1px;
    }
`


const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    background-color: #000;
`

const Column = styled.div`
    flex-direction: column;
    align-items: center;
    display: flex;
    width: 100%;
    height: 100%;
    gap: 8px;
    padding: 16px;

`