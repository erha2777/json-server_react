import React, { useState, useEffect } from 'react';
import type { InputNumberProps } from 'antd';
import { InputNumber } from 'antd';

// Number类型 mock规则生成组件
const MockNumber: React.FC<{ name: string; mock: string; onChange?: (mock: any) => void }> = ({ name, mock, onChange }) => {
    const [num, setNum] = useState(0);
    const setNumFn: InputNumberProps['onChange'] = (value) => {
        if (typeof value === 'number') {
            setNum(value);
        }
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

    const [interval2, setInterval2] = useState([1, 1]);
    const setIntervalMin2: InputNumberProps['onChange'] = (value) => {
        if (typeof value === 'number') {
            setInterval2([value, interval2[1]]);
        }
    };
    const setIntervalMax2: InputNumberProps['onChange'] = (value) => {
        if (typeof value === 'number') {
            setInterval2([interval2[0], value]);
        }
    };

    const changeFn = () => {
        if (mock === '+1') {
            onChange &&
                onChange({
                    [`${name}|+1`]: num,
                });
        } else if (mock === 'min-max') {
            onChange &&
                onChange({
                    [`${name}|${getInterval(interval)}`]: 1,
                });
        } else if (mock === 'min-max.dmin-dmax') {
            onChange &&
                onChange({
                    [`${name}|${getInterval(interval)}.${getInterval(interval2)}`]: 1,
                });
        }
    };

    useEffect(() => {
        changeFn();
    }, [name, mock, num, interval, interval2]);

    return mock === '+1' ? (
        <>
            <p>
                'name|+1': number <br />
                属性值自动加 1，初始值为 number。
            </p>
            <div style={{ display: 'flex' }} key={mock}>
                <InputNumber defaultValue={num} onChange={setNumFn} />
            </div>
            {name} | +1 : {num}
        </>
    ) : mock === 'min-max' ? (
        <>
            <p>
                'name|min-max': number <br />
                生成一个大于等于 min、小于等于 max 的整数，属性值 number 只是用来确定类型。
            </p>
            <div style={{ display: 'flex' }} key={mock}>
                <InputNumber defaultValue={interval[0]} onChange={setIntervalMin} />-
                <InputNumber defaultValue={interval[1]} onChange={setIntervalMax} />
            </div>
            {name} | {getInterval(interval)} : {1}
        </>
    ) : mock === 'min-max.dmin-dmax' ? (
        <>
            <p>
                'name|min-max.dmin-dmax': number <br />
                生成一个浮点数，整数部分大于等于 min、小于等于 max，小数部分保留 dmin 到 dmax 位。
            </p>
            <div style={{ display: 'flex' }} key={mock}>
                <InputNumber defaultValue={interval[0]} onChange={setIntervalMin} />-
                <InputNumber defaultValue={interval[1]} onChange={setIntervalMax} />.
                <InputNumber defaultValue={interval2[0]} onChange={setIntervalMin2} />-
                <InputNumber defaultValue={interval2[1]} onChange={setIntervalMax2} />
            </div>
            {name} | {getInterval(interval)}.{getInterval(interval2)} : {1}
        </>
    ) : (
        <></>
    );
};

export default MockNumber;
