import styled from "styled-components";
import {Header} from "../components/header.tsx";
import {ListItem} from "../components/list-item.tsx";
import {RefreshIcon} from "../components/icons/refresh.tsx";
import {Bottom} from "../components/bottom.tsx";
import {joinGame, leaveGame, quickGame, useGame} from "../api/requests/game.tsx";
import {useNavigate} from "react-router";
import {LowBalance} from "../components/low-balance.tsx";
import {useState} from "react";

export const MainView = () => {
    const [isLowBalance, setIsLowBalance] = useState(false)

    const nav = useNavigate()
    const {data, mutate} = useGame({
        limit: 10,
    })

    const onItemClick = async (gameId: number) => {
        // await leaveGame()
        const response = await joinGame({gameId})
        if (response.id) {
            nav(`/game/${gameId}`)
        }
    }


    const onQuickGame = async () => {
        // await leaveGame()

        const response = await quickGame({players: 2})
        if (response.id) {
            nav(`/game/${response.id}`)
        }
    }

    return (
        <Container>
            <Header name="John Doe" games={5} value={100} secondValue={200}/>
            <Content>
                <Row>
                    <Title onClick={() => {
                        setIsLowBalance(true)
                    }}>
                        Список игр
                    </Title>
                    <Refresh onClick={async () => {
                        await mutate()
                    }}>
                        Обновить
                        <RefreshIcon/>
                    </Refresh>
                </Row>
                <List>
                    {data?.map((page) => page.items.map((game) => <ListItem
                        onItem={onItemClick}
                        game={game} key={game.id}/>))}
                </List>
            </Content>
            <Bottom onQuickPlay={onQuickGame}/>
            <LowBalance visible={isLowBalance} onClose={() => setIsLowBalance(false)}/>
        </Container>
    )
}


const List = styled.div`
    display: flex;
    gap: 8px;
    flex-direction: column;
    width: 100%;
    padding-bottom: 160px;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }

    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
    overflow: scroll;

`


const Row = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`

const Title = styled.div`
    color: #FAFEFC;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 19.2px */
`

const Refresh = styled.div`
    color: #FFF;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 19.2px */
    opacity: 0.4;
    display: flex;
    align-items: center;
    gap: 3px;

    &:active {
        transform: scale(0.95);
    }

    cursor: pointer;

`

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    background-color: #000;
`

const Content = styled.div`
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    height: 100vh;
    align-self: stretch;
`
