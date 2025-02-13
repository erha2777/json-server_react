import React, { useState, useEffect } from 'react';
import type { InputNumberProps, RadioChangeEvent } from 'antd';
import { InputNumber, Radio } from 'antd';

// Number类型 mock规则生成组件
const MockBoolean: React.FC<{ name: string; mock: string; onChange?: (mock: any) => void }> = ({ name, mock, onChange }) => {
    const [booleanVal, setBoolean] = useState(true);

    const setBooleanFn = ({ target: { value } }: RadioChangeEvent) => {
        setBoolean(value);
    };

    const [interval, setInterval] = useState([1, 1]);
    const setIntervalMin: InputNumberProps['onChange'] = (value) => {
        if (typeof value === 'number') {
            setInterval([value, interval[1]]);
        }
    };
    const setIntervalMax: InputNumberProps['onChange'] = (value) => {
        if (typeof value === 'number') {
            setInterval([interval[0], value]);
        }
    };
    const getInterval = (interval: number[]) => {
        return `${interval[0]}-${interval[1]}`;
    };

    const changeFn = () => {
        if (mock === '1') {
            onChange &&
                onChange({
                    [`${name}|1`]: booleanVal,
                });
        } else if (mock === 'min-max') {
            onChange &&
                onChange({
                    [`${name}|${getInterval(interval)}`]: booleanVal,
                });
        }
    };

    useEffect(() => {
        changeFn();
    }, [name, mock, booleanVal, interval]);

    return mock === '1' ? (
        <>
            <p>
                'name|1': boolean
                <br />
                随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率同样是 1/2。
            </p>
            {name} | 1 : {`${booleanVal}`}
        </>
    ) : mock === 'min-max' ? (
        <>
            <p>
                'name|min-max': value <br />
                随机生成一个布尔值，值为 value 的概率是 min / (min + max)，值为 !value 的概率是 max / (min + max)。
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }} key={mock}>
                <Radio.Group
                    value={booleanVal}
                    onChange={setBooleanFn}
                    options={[
                        { value: true, label: 'true' },
                        { value: false, label: 'false' },
                    ]}
                />
                <InputNumber min={1} defaultValue={interval[0]} onChange={setIntervalMin} />-
                <InputNumber min={1} defaultValue={interval[1]} onChange={setIntervalMax} />
            </div>
            {name} | {getInterval(interval)} : {`${booleanVal}`}
        </>
    ) : (
        <></>
    );
};

export default MockBoolean;
