import styled from "styled-components";


interface Props {
    value: number;
    onChange: (value: number) => void;
}

export const NumberOFPlayers = ({ value, onChange }: Props) => {
    const possibleNumbers = [2, 3, 4, 5, 6]
    return (
        <Container>
            <Label>
                Игроки
            </Label>
            <Row>
                {possibleNumbers.map((number) => (
                    <Item
                        onClick={() => onChange(number)}
                        $isActive={number === value}
                        >
                        {number}
                    </Item>
                ))}
            </Row>
        </Container>
    )
}


const Row = styled.div`
    display: flex;
    height: 52px;
    padding: 4px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    border-radius: 12px;
    background: #08080D;
`

const Item = styled.div<{ $isActive: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex: 1 0 0;
    align-self: stretch;
    border-radius: 8px;
    color: #FFF;
    text-align: center;
    font-size: 16px;
    -webkit-text-stroke-width: ${({$isActive}) => $isActive ? '1px' : '0px'};
    -webkit-text-stroke-color: ${({$isActive}) => $isActive ? '#180A03' : 'transparent'};
    font-style: normal;
    font-weight: ${({$isActive}) => $isActive ? '700' : '500'};
    line-height: 120%;
    background: ${({$isActive}) => $isActive ? 'linear-gradient(180deg, #64CB48 0%, #53BE36 100%)' : '#262529'};
    position: relative;
    
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