import React, { useState, useEffect } from 'react';
import type { InputNumberProps } from 'antd';
import { Input, InputNumber } from 'antd';

// String类型 mock规则生成组件
const MockString: React.FC<{ name: string; mock: string; onChange?: (mock: any) => void }> = ({
    name,
    mock,
    onChange,
}) => {
    const [str, setStr] = useState('');
    const setStrFn = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setStr(e.target.value);
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

    const [count, setCount] = useState(1);
    const setCountFn: InputNumberProps['onChange'] = (value) => {
        if (typeof value === 'number') {
            setCount(value);
        }
    };

    const getInterval = (interval: number[]) => {
        return `${interval[0]}-${interval[1]}`;
    };

    const changeFn = () => {
        if (mock === 'min-max') {
            onChange &&
                onChange({
                    [`${name}|${getInterval(interval)}`]: str,
                });
        } else {
            onChange &&
                onChange({
                    [`${name}|${count}`]: str,
                });
        }
    };

    useEffect(() => {
        changeFn();
    }, [name, mock, str, interval, count]);

    return mock === 'min-max' ? (
        <>
            <p>
                'name|min-max': string <br />
                通过重复 string 生成一个字符串，重复次数大于等于 min，小于等于 max。
            </p>
            <div style={{ display: 'flex' }} key={mock}>
                <Input defaultValue={str} placeholder="输入需要重复的字符串" onChange={setStrFn} />
                <InputNumber min={1} max={10} defaultValue={interval[0]} onChange={setIntervalMin} />-
                <InputNumber min={1} max={10} defaultValue={interval[1]} onChange={setIntervalMax} />
            </div>
            {name} | {getInterval(interval)} : {str}
        </>
    ) : (
        <>
            <p>
                'name|count': string <br />
                通过重复 string 生成一个字符串，重复次数等于 count。
            </p>
            <div style={{ display: 'flex' }} key={mock}>
                <Input defaultValue={str} placeholder="输入需要重复的字符串" onChange={setStrFn} />
                <InputNumber min={1} max={10} defaultValue={count} onChange={setCountFn} />
            </div>
            {name} | {count} : {str}
        </>
    );
};

export default MockString;
