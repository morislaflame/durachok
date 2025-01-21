import styled from "styled-components";
import {Table2Icon} from "./icons/table/2.tsx";
import {PlayIcon} from "./icons/play.tsx";

export const ListItem = () => {
    return (
        <Container>
            <Table2Icon/>
            <Middle>
                <Name>
                    Пати нубов
                </Name>
                <MiddleRow>
                    <Span>
                        Игроки <Span style={{color:'#FFF'}}>2</Span> / 6
                    </Span>
                    <Span>
                        •
                    </Span>
                    <Span>
                        Карт <Span style={{color:'#FFF'}}>36</Span>
                    </Span>
                </MiddleRow>
            </Middle>
            <PlayButton>
                <SPlayIcon/>
            </PlayButton>
        </Container>
    )
}


const SPlayIcon = styled(PlayIcon)`
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const PlayButton = styled.div`
    display: flex;
    width: 40px;
    height: 40px;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 46px;
    background: linear-gradient(180deg, #64CB48 0%, #53BE36 100%);
    box-shadow: 0px 2px 2px -2px #53BE36, 0px 2px 0px 0px #2A5F1B;
    position: relative;

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

const MiddleRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    `

const Span = styled.span`
    color: rgba(255, 255, 255, 0.40);
    text-align: center;
     font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 15.6px */
`


const Container = styled.div`
    display: flex;
    padding: 12px;
    justify-content: center;
    align-items: center;
    gap: 16px;
    align-self: stretch;
    border-radius: 16px;
    background: #131318;
    box-shadow: 0px 2px 0px 0px #000;

    position: relative;

    &:before {
        position: absolute;
        pointer-events: none;
        content: "";
        border-radius: 16px;
        inset: 0;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.00) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        padding: 1px;
    }
`

const Middle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    flex: 1 0 0;
`

const Name = styled.div`
    overflow: hidden;
    color: #FFF;
    text-overflow: ellipsis;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 19.2px */
`