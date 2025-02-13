import React, { useState, useEffect } from 'react';
import type { InputNumberProps } from 'antd';
import { InputNumber, Input } from 'antd';
const { TextArea } = Input;
// Number类型 mock规则生成组件
const MockObject: React.FC<{ name: string; mock: string; onChange?: (mock: any) => void }> = ({ name, mock, onChange }) => {
    const [objVal, setObjVal] = useState('{}');
    const [error, setError] = useState('');

    const setObjValFn = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        try {
            // 尝试解析 JSON
            const parsedObj = JSON.parse(inputValue);
            // 格式化 JSON
            const formattedJson = JSON.stringify(parsedObj, null, 4);
            setObjVal(formattedJson);
            setError(''); // 清空错误信息
        } catch (err) {
            // 如果解析失败，设置错误信息
            setError('输入的 JSON 格式不正确，请检查！');
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

    const [count, setCount] = useState(1);
    const setCountFn: InputNumberProps['onChange'] = (value) => {
        if (typeof value === 'number') {
            setCount(value);
        }
    };

    const changeFn = () => {
        if (mock === 'count') {
            onChange &&
                onChange({
                    [`${name}|${count}`]: JSON.parse(objVal),
                });
        } else if (mock === 'min-max') {
            onChange &&
                onChange({
                    [`${name}|${getInterval(interval)}`]: JSON.parse(objVal),
                });
        }
    };

    useEffect(() => {
        changeFn();
    }, [name, mock, objVal, count, interval]);

    return mock === 'count' ? (
        <>
            <p>
                'name|count': object
                <br />
                从属性值 object 中随机选取 count 个属性。
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }} key={mock}>
                <TextArea value={objVal} placeholder="请输入 JSON 对象" autoSize={{ minRows: 2 }} onChange={setObjValFn} />
                <InputNumber min={1} max={10} defaultValue={count} onChange={setCountFn} />
            </div>
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            <pre>
                {name} | {count} : {objVal}
            </pre>
        </>
    ) : mock === 'min-max' ? (
        <>
            <p>
                'name|min-max': object
                <br />
                从属性值 object 中随机选取 min 到 max 个属性。
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }} key={mock}>
                <TextArea value={objVal} placeholder="请输入 JSON 对象" autoSize={{ minRows: 2 }} onChange={setObjValFn} />
                <InputNumber min={1} defaultValue={interval[0]} onChange={setIntervalMin} />-
                <InputNumber min={1} defaultValue={interval[1]} onChange={setIntervalMax} />
            </div>
            <pre>
                {name} | {getInterval(interval)} : {objVal}
            </pre>
        </>
    ) : (
        <></>
    );
};

export default MockObject;
