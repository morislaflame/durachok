import styled from "styled-components";
import {Switch} from "./switch.tsx";


interface OnlyForFiendsProps {
    onChange: (value: boolean) => void;
    value: boolean;
}

export const OnlyForFiends = ({ value, onChange }: OnlyForFiendsProps) => {
    return (
        <Container>
            <Label>
                Только для друзей
            </Label>
            <Switch
                value={value}
                onChange={onChange}
            />
        </Container>
    )
}


const Label = styled.div`
    flex: 1 0 0;
    color: #FAFEFC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 16.8px */
    margin-right: auto;
`
const Container = styled.div`
    display: flex;
    padding: 12px;
    justify-content: space-between;
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