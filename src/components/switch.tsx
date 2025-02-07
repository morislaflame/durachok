import styled from 'styled-components';


interface OnlyForFiendsProps {
    onChange: (value: boolean) => void;
    value: boolean;
}

export const Switch = ({value, onChange}: OnlyForFiendsProps) => {

    const toggleSwitch = () => {
        onChange(!value);
    };

    return (
        <SwitchContainer onClick={toggleSwitch} isOn={value}>
            <SwitchToggle isOn={value}/>
        </SwitchContainer>
    );
};

const SwitchContainer = styled.div<{ isOn: boolean }>`
    width: 50px;
    height: 25px;
    background: ${({isOn}) => (isOn ? 'linear-gradient(0deg, #64CB48 0%, #64CB48 100%)' : '#FFF')};
    border-radius: 14px;
    display: flex;
    align-items: center;
    padding: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
`;


const SwitchToggle = styled.div<{ isOn: boolean }>`
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: ${({isOn}) => (isOn ? 'translateX(22px)' : 'translateX(0)')};
    transition: transform 0.3s ease;
`;
