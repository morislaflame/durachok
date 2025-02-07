import * as React from 'react';
import { Range, getTrackBackground } from 'react-range';
import styled from 'styled-components';

const STEP = 100;
const MIN = 100;
const MAX = 50000;




interface RangeSliderProps {
    values: number[];
    onChange: (values: number[]) => void;
}


export const RangeSlider = ({ values, onChange }: RangeSliderProps) => {

    const formatValue = (value: number) => {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1).replace('.0', '')}к`;
        }
        return `${value}`;
    };

    return (
        <Container>
            <Label>
                Ваша ставка
            </Label>
            <Label>
                {formatValue(values[0])}
            </Label>
            <Range
                values={values}
                step={STEP}
                min={MIN}
                max={MAX}
                rtl={false}
                onChange={(values) => onChange(values)}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            display: 'flex',
                            width: '100%',
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                                height: '8px',
                                width: '92%',
                                borderRadius: '4px',
                                margin: '0px auto',
                                background: getTrackBackground({
                                    values,
                                    colors: ['#64CB48', '#08080D'],
                                    min: MIN,
                                    max: MAX,
                                 }),
                                alignSelf: 'center',
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ props }) => (
                    <Thumb
                        {...props}
                        key={props.key}
                        style={{
                            ...props.style,
                        }}
                    />
                )}
            />
            <ScaleContainer>
                <ScaleLabel>
                    {formatValue(MIN)}
                </ScaleLabel>
                <ScaleLabel>
                    {formatValue(MAX / 4)}
                </ScaleLabel>
                <ScaleLabel>
                    {formatValue(MAX / 2)}
                </ScaleLabel>
                <ScaleLabel>
                    {formatValue(37500)}
                </ScaleLabel>
                <ScaleLabel>
                    {formatValue(MAX)}
                </ScaleLabel>
            </ScaleContainer>

        </Container>
    );
};

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


const Label = styled.div `
    color: #FAFEFC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 16.8px */
    margin-right: auto;
`



const Thumb = styled.div`
    display: flex;
    width: 28px;
    height: 28px;
    justify-content: center;
    align-items: center;
    border-radius: 32px;
    border: 1px solid #A2E091;
    background: linear-gradient(180deg, #64CB48 0%, #53BE36 100%);
`;

const ScaleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
    padding: 0 5px;
`;

const ScaleLabel = styled.div`
    color: #fff;
    font-size: 14px;
`;
