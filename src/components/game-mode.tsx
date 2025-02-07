// Game Mode


import styled from "styled-components";
import {TrashIcon} from "./icons/trash.tsx";
import {LockIcon} from "./icons/lock.tsx";
import {InfoIcon} from "./icons/info.tsx";

export const GameMode = () => {
    return (
        <Container>
            <Label>
                Игровой режим
                <InfoIcon/>
            </Label>
            <Wrap>
                <ItemContainer $isBlocked>
                    <LockContainer>
                        <SLockIcon/>
                    </LockContainer>
                    <Item $isActive={true}>
                        <TrashIcon/>
                        Классика
                    </Item>
                    <Item $isActive={false}>
                        <TrashIcon/>
                        Классика
                    </Item>
                </ItemContainer>
                <ItemContainer>
                    <Item $isActive={true}>
                        <TrashIcon/>
                        Классика
                    </Item>
                    <Item $isActive={false}>
                        <TrashIcon/>
                        Классика
                    </Item>
                </ItemContainer>
                <ItemContainer $isBlocked>
                    <LockContainer>
                        <SLockIcon/>
                    </LockContainer>
                    <Item $isActive={true}>
                        <TrashIcon/>
                        Классика
                    </Item>
                    <Item $isActive={false}>
                        <TrashIcon/>
                        Классика
                    </Item>
                </ItemContainer>
                <ItemContainer>
                    <Item $isActive={true}>
                        <TrashIcon/>
                        Классика
                    </Item>
                    <Item $isActive={false}>
                        <TrashIcon/>
                        Классика
                    </Item>
                </ItemContainer>
            </Wrap>
        </Container>

    )
}




const SLockIcon = styled(LockIcon)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    
    `

const LockContainer = styled.div`
    display: flex;
    width: 24px;
    height: 24px;
    padding: 0px 16px;
    justify-content: center;
    align-items: center;
    gap: 6px;
    position: absolute;
    right: -0.5px;
    border-radius: 0px 12px;
    background: #666;
    top: 0;
`


const Label = styled.div`
    flex: 1 0 0;
    color: #FAFEFC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 16.8px */
    margin-right: auto;
    display: flex;
    align-items: center;
    gap: 4px;
`

const Container = styled.div`
    display: flex;
    padding: 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
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

const Wrap = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: flex-start;
    align-content: flex-start;
    gap: 8px;
    align-self: stretch;
    flex-wrap: wrap;
`


const ItemContainer = styled.div<{ $isBlocked?: boolean }>`
    position: relative;
    display: flex;
    min-width: 120px;
    padding: 4px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    flex: 1 0 0;
    border-radius: 12px;
    background: #08080D;
    opacity: ${({$isBlocked}) => $isBlocked ? '0.6' : '1'};
`

const Item = styled.div<{ $isActive: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    flex: 1 0 0;
    align-self: stretch;
    border-radius: 8px;
    padding: 8px;
    color: #FFF;
    text-align: center;
    font-size: 11px;
    font-style: normal;
    font-weight: ${({$isActive}) => $isActive ? '400' : '400'};
    line-height: 120%;
    background: ${({$isActive}) => $isActive ? 'linear-gradient(180deg, #64CB48 0%, #53BE36 100%)' : '#262529'};
    position: relative;
    opacity: ${({$isActive}) => $isActive ? '1' : '0.6'};

    &:before {
        position: absolute;
        pointer-events: none;
        content: "";
        border-radius: 8px;
        inset: 0;
        background: ${({$isActive}) => $isActive ? 'linear-gradient(180deg, #A2E091 0%, rgba(162, 224, 145, 0.00) 100%)' : 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.00) 100%)'};
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        padding: 1px;
    }

`