import React from 'react';
import styled from "styled-components";

interface Props {
    onStartGame?: () => void;
    onBeat?: () => void;
    isBeatVisible?: boolean;
    onTakeCards?: () => void;
    isTakeVisible?: boolean;
}

const UserActions: React.FC<Props> = ({onBeat, isBeatVisible, onTakeCards, isTakeVisible}) => {
    return (
        <Row>
            {isBeatVisible && (
                <ActionButton onClick={onBeat}>
                    Бито
                </ActionButton>
            )}
            {isTakeVisible && (
                <ActionButton onClick={onTakeCards}>
                    Take
                </ActionButton>
            )}
        </Row>
    );
};
export default UserActions;


const Row = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`


const ActionButton = styled.div`
    display: flex;
    padding: 0px 24px;
    justify-content: center;
    align-items: center;
    gap: 12px;
    flex: 1 0 0;
    align-self: stretch;
    border-radius: 8px;
    background: #FFF;
    box-shadow: 0px 0px 4px -3px rgba(20, 57, 93, 0.64), 0px 2px 12px -6px rgba(20, 57, 93, 0.64);

    color: #CF2F3B;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 24px */
    box-sizing: border-box;
    height: 48px;
    width: 100%;
    max-width: 200px;
`
