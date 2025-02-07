import {GrayCoins} from "./icons/coins/grey-coins.tsx";
import styled, {keyframes} from "styled-components";
import {PlusIcon} from "./icons/plus.tsx";
import {CloseIcon} from "./icons/close.tsx";

export const LowBalance = ({visible, onClose}: { visible: boolean, onClose: () => void }) => {
    if (!visible) {
        return null
    }
    return (
        <Overlay>
            <Modal>
                <CloseIcon
                    style={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        cursor: 'pointer'
                    }}
                    onClick={onClose}
                />
                <GrayCoins style={{
                    opacity: 0.6,
                    mixBlendMode: 'luminosity'
                }}/>
                <Text>
                    Не достаточно
                    средств на балансе
                </Text>
                <PrimaryButton>
                    <PlusIcon/>
                    Пополнить
                </PrimaryButton>
            </Modal>
        </Overlay>
    )
}


const fadeIn = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
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

    &:active {
        transform: scale(0.95);
    }

    cursor: pointer;
`


const Text = styled.div`
    color: #FAFEFC;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 24px */
`

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: ${fadeIn} 0.3s ease;
`


const Modal = styled.div`
    display: flex;
    max-width: 329px;
    padding: 24px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    background: #131318;
    box-shadow: 0px 2px 0px 0px #000;
    position: relative;

    border-radius: 16px;

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