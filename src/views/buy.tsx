import styled from "styled-components";
import {Header} from "../components/header.tsx";
import React from "react";
import {Coins1} from "../components/icons/coins/1.tsx";
import {IconProps} from "../types/types.ts";
import {Coins2} from "../components/icons/coins/2.tsx";
import {Coins3} from "../components/icons/coins/3.tsx";
import {Coins4} from "../components/icons/coins/4.tsx";
import {Coins7} from "../components/icons/coins/7.tsx";
import {Coins6} from "../components/icons/coins/6.tsx";
import {Coins5} from "../components/icons/coins/5.tsx";


interface IData {
    id: number;
    amount: number;
    amountStars: number;
    icon: React.ReactNode;
}

const data = [
    {
        id: 1,
        amount: 100,
        amountStars: 200,
        icon: <Coins1/>
    }, {
        id: 1,
        amount: 100,
        amountStars: 200,
        icon: <Coins2/>
    }, {
        id: 1,
        amount: 100,
        amountStars: 200,
        icon: <Coins3/>
    },
    {
        id: 1,
        amount: 100,
        amountStars: 200,
        icon: <Coins4/>
    },
    {
        id: 1,
        amount: 100,
        amountStars: 200,
        icon: <Coins5/>
    }, {
        id: 1,
        amount: 100,
        amountStars: 200,
        icon: <Coins6/>
    }, {
        id: 1,
        amount: 100,
        amountStars: 200,
        icon: <Coins7/>
    }
]

export const BuyView = () => {
    return (
        <Container>
            <Header name="John Doe" games={5} value={100} secondValue={200}/>
            <Title>
                Купить
            </Title>
            <Wrap>
                {data.map((item: IData) => (
                    <Card key={item.id}>
                        {item.icon}
                        <Amount>
                            {item.amount}
                        </Amount>
                        <StarsContainer>
                            <StarsAmount>
                                {item.amountStars}
                            </StarsAmount>
                            <Star/>
                        </StarsContainer>
                    </Card>
                ))}
            </Wrap>
        </Container>
    )
}


const Amount = styled.div`
    color: #FFEF41;
    text-align: right;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 18px */
    letter-spacing: -0.15px;
`


const StarsContainer = styled.div`
    display: flex;
    height: 32px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.04);
    background: #262529;
`
const StarsAmount = styled.div`
    color: #FFF;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 15.6px */
`

const Wrap = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    width: 100%;
    padding: 16px;

    & > :last-child {
        grid-column: span 3; /* Last child takes full width */
    }
`;


const Card = styled.div`
    display: flex;
    align-self: stretch;
    border-radius: 16px;
    background: #131318;
    box-shadow: 0px 2px 0px 0px #000;
    position: relative;
    min-width: 90px;
    padding: 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    flex: 1 0 0;
    &:active {
        transform: scale(0.95);
    }

    cursor: pointer;

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

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    background-color: #000;
`


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


const Star = (props: IconProps) => {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M10.1437 1.32188C10.0573 1.34586 9.93755 1.39093 9.87765 1.42204C9.70463 1.51186 9.4554 1.81631 9.31824 2.10541C9.14547 2.46952 8.77741 3.2333 8.44132 3.92522C8.28744 4.24204 8.00285 4.82916 7.80896 5.22997C7.46425 5.94242 7.36172 6.09561 7.18448 6.16302C7.1082 6.19203 6.23952 6.3368 5.5204 6.44038C5.27246 6.4761 3.80574 6.70005 3.01808 6.82248C2.77598 6.86011 2.50546 6.92194 2.41696 6.95989C2.19172 7.05645 1.96393 7.27866 1.84949 7.5135C1.76731 7.68215 1.75195 7.75888 1.7501 8.00975C1.74696 8.43192 1.81357 8.55338 2.47781 9.33635C2.73199 9.63599 3.37906 10.2428 3.62396 10.4112C3.96782 10.6476 4.04568 10.6784 4.48429 10.7515C4.78934 10.8023 4.98634 10.8086 5.72361 10.7913C6.55001 10.7718 6.90463 10.7411 7.82212 10.6093C8.52466 10.5085 9.78461 10.2638 10.6966 10.0511C11.191 9.93583 11.2957 9.92979 11.2957 10.0166C11.2957 10.0846 11.2355 10.1212 10.8768 10.2709C9.4272 10.8758 7.87581 11.7338 6.86208 12.4911C6.42779 12.8156 6.34512 12.8871 5.97099 13.2621C5.38732 13.8472 5.19706 14.1968 5.01154 15.0253C4.85605 15.7196 4.68946 16.8018 4.70496 17.0167C4.72123 17.2425 4.85092 17.5437 5.00962 17.7245C5.15077 17.8852 5.49697 18.0586 5.73265 18.0865C6.06807 18.1262 6.24465 18.0539 7.57774 17.3309C7.67375 17.2788 7.85441 17.1808 7.97921 17.113C8.10402 17.0452 8.70099 16.7263 9.30581 16.4043C10.5279 15.7537 10.5479 15.7472 10.8593 15.9037C11.1708 16.0602 12.4942 16.7438 12.7096 16.8595C12.8248 16.9213 13.3746 17.2055 13.9315 17.491C14.9439 18.0102 14.9439 18.0102 15.2406 18.0109C15.4907 18.0115 15.5688 17.9968 15.7378 17.9177C16.1014 17.7472 16.3483 17.4021 16.4083 16.9804C16.4282 16.8402 16.3253 16.1894 16.0442 14.6777C16.0245 14.5721 15.9776 14.3128 15.9398 14.1016C15.902 13.8904 15.8156 13.4097 15.7478 13.0334C15.6086 12.2602 15.5983 12.0806 15.686 11.954C15.7194 11.9057 16.444 11.1752 17.2962 10.3307C18.1484 9.48618 18.8922 8.74811 18.9491 8.69051C19.223 8.41346 19.3289 7.88983 19.1871 7.51395C19.0901 7.25722 18.8502 6.99141 18.6088 6.87327C18.4192 6.78055 18.2331 6.74945 16.3228 6.49132C14.6928 6.27103 13.9109 6.15195 13.7841 6.10468C13.5323 6.01085 13.6493 6.21724 12.1281 3.18275C11.7453 2.41918 11.3863 1.7423 11.3304 1.67859C11.0346 1.34164 10.5727 1.2028 10.1437 1.32188Z"
                  fill="url(#paint0_linear_807_334)"/>
            <defs>
                <linearGradient id="paint0_linear_807_334" x1="19.25" y1="5.93111" x2="1.75" y2="13.4439"
                                gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FC48FF"/>
                    <stop offset="1" stop-color="#1895FF"/>
                </linearGradient>
            </defs>
        </svg>
    )
}