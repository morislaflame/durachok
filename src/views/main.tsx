import styled from "styled-components";
import {Header} from "../components/header.tsx";
import {ListItem} from "../components/list-item.tsx";
import {RefreshIcon} from "../components/icons/refresh.tsx";
import {Bottom} from "../components/bottom.tsx";

export const MainView = () => {
    return (
        <Container>
            <Header name="John Doe" games={5} value={100} secondValue={200}/>
            <Content>
                <Row>
                    <Title>
                        Список игр
                    </Title>
                    <Refresh>
                        Обновить
                        <RefreshIcon/>
                    </Refresh>
                </Row>
                <List>
                    {
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <ListItem key={i}/>)
                    }
                </List>
            </Content>
            <Bottom/>
        </Container>
    )
}


const List = styled.div`
    display: flex;
    gap: 8px;
    flex-direction: column;
    width: 100%;
    overflow-y: auto;
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
    gap: 3px
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
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex: 1 0 0;
    align-self: stretch;

`
