import styled from "styled-components";
import React from "react";
import {Coin} from "./icons/coin.tsx";
import {useNavigate} from "react-router";

interface HeaderProps {
    name: string;
    games: number;
    value: number;
    secondValue?: number;
}

export const Header = ({name, games, value}: HeaderProps) => {


    const nav = useNavigate()

    const onClick = () => {
        nav('/buy')
    }

    return (
        <Container>
            <Left>
                <Avatar/>
                <LeftCol>
                    <Name>{name}</Name>
                    <Games>{games} games</Games>
                </LeftCol>
            </Left>
            <Right>
                <RightCol>
                    <Value1>
                        {value} <Coin style={{
                        width: 20,
                        height: 20
                    }}/>
                    </Value1>
                </RightCol>
                <PlusButton onClick={onClick}>
                    <StyledPlusIcon/>
                </PlusButton>
            </Right>
        </Container>
    )
}


const Container = styled.div`
    display: flex;
    padding: 16px;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    background: #131318;
`

const Avatar = styled.div`
    display: flex;
    width: 40px;
    height: 40px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 100px;
    background: lightgray;

`


const Left = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1 0 0;
`

const LeftCol = styled.div`
    display: flex;
    height: 40px;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    flex: 1 0 0;
`


const RightCol = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
`

const Name = styled.div`
    overflow: hidden;
    color: #FAFEFC;
    text-overflow: ellipsis;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 19.2px */
    letter-spacing: -0.16px;
`


const Games = styled.div`
    overflow: hidden;
    color: rgba(255, 255, 255, 0.40);
    text-overflow: ellipsis;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 15.6px */
    letter-spacing: -0.13px;
`


const Right = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`


const Value1 = styled.div`
    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 19.2px */
    letter-spacing: -0.16px;
    display: flex;
    align-items: center;
    gap: 4px;
`




const PlusButton = styled.div`
    display: flex;
    width: 40px;
    height: 40px;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 46px;
    background: linear-gradient(135deg, #64CB48 0%, #FFD519 100%);
    box-shadow: 0px 2px 2px -2px #53BE36, 0px 2px 0px 0px #5F531B;
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
    &:active {
        transform: scale(0.95);
    }

    cursor: pointer;
`


const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            {...props}

            xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <g clip-path="url(#clip0_213_5445)">
                <path
                    d="M7.34091 16.4773C7.34091 17.9459 8.53142 19.1364 10 19.1364C11.4686 19.1364 12.6591 17.9459 12.6591 16.4773V12.6591H16.4773C17.9458 12.6591 19.1364 11.4686 19.1364 10C19.1364 8.53144 17.9458 7.34092 16.4773 7.34092H12.6591V3.52274C12.6591 2.05416 11.4686 0.863647 10 0.863647C8.53142 0.863647 7.34091 2.05416 7.34091 3.52274V7.34092L3.52273 7.34092C2.05415 7.34092 0.863636 8.53143 0.863636 10C0.863636 11.4686 2.05415 12.6591 3.52273 12.6591L7.34091 12.6591V16.4773Z"
                    fill="#FAFEFC" stroke="#180A03" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_213_5445">
                    <rect width="20" height="20" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    )
}


const StyledPlusIcon = styled(PlusIcon)`
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`