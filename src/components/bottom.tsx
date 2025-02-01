import styled from "styled-components";
import {PlayIcon} from "./icons/play.tsx";
import {PlusIcon} from "./icons/plus.tsx";
import {useNavigate} from "react-router";



interface Props{
    onQuickPlay: () => void
}

export const Bottom = ({onQuickPlay}: Props) => {
    const nav = useNavigate()


    const onCreate = () => {
        nav('/create')
    }

    return (
        <Container>
            <Content>
                <SecondaryButton onClick={onQuickPlay}>
                    <PlayIcon/>
                    <span>
                    Быстрая игра
                        </span>
                </SecondaryButton>
                <PrimaryButton onClick={onCreate}>
                    <PlusIcon/>
                    Создать игру
                </PrimaryButton>
            </Content>
        </Container>
    )
}

const Container = styled.div`
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


const Content = styled.div`
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


const PrimaryButton = styled.div`
    position: relative;
    display: flex;
    height: 52px;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 46px;
    background: linear-gradient(180deg, #64CB48 0%, #53BE36 100%);
    box-shadow: 0px 2px 2px -2px #53BE36, 0px 2px 0px 0px #2A5F1B;
    width: 40%;
    min-width: 160px;
    color: #180A03;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 19.2px */

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

const SecondaryButton = styled.div`
    display: flex;
    height: 52px;
    padding: 16px;
    width: 70%;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 46px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, #FFDD47 0%, #FFD519 100%);

    box-shadow: 0px 2px 2px -2px #FFD519, 0px 2px 0px 0px #5F531B;
    color: #180A03;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 19.2px */
    @media (max-width: 380px) {
        font-size: 14px;
    }
    isolation: isolate;

    &:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        inset: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="203" height="52" viewBox="0 0 203 52" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.78623 0H-5L15.5471 26L-5 52H9.78623L30.3333 26L9.78623 0ZM45.1196 0H30.3333L50.8804 26L30.3333 52H45.1196L65.6667 26L45.1196 0ZM65.6667 0H80.4529L101 26L80.4529 52H65.6667L86.2138 26L65.6667 0ZM151.12 0H136.333L156.88 26L136.333 52H151.12L171.667 26L151.12 0ZM101 0H115.786L136.333 26L115.786 52H101L121.547 26L101 0ZM186.453 0H171.667L192.214 26L171.667 52H186.453L207 26L186.453 0Z" fill="url(%23paint0_linear_213_260)"/><defs><linearGradient id="paint0_linear_213_260" x1="101" y1="0" x2="101" y2="52" gradientUnits="userSpaceOnUse"><stop stop-color="%23FFEA90"/><stop offset="1" stop-color="%23FFEA90" stop-opacity="0.4"/></linearGradient></defs></svg>');
        background-size: cover;
        z-index: -1;
    }

    &:after {
        position: absolute;
        pointer-events: none;
        content: "";
        border-radius: 100px;
        inset: 0;
        background: linear-gradient(180deg, #FFEA90 0%, rgba(255, 234, 144, 0.00) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        padding: 1px;
    }

    &:active {
        transform: scale(0.95);
    }

    cursor: pointer;
`