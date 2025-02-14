import React, { useState, useEffect } from 'react';
import { Input, InputNumber, Alert } from 'antd';
import type { InputNumberProps } from 'antd';

const MockArray: React.FC<{
  name: string;
  mock: string;
  onChange?: (mock: any) => void;
}> = ({ name, mock, onChange }) => {
  const [arrayStr, setArrayStr] = useState('');
  const [interval, setInterval] = useState([1, 1]);
  const [count, setCount] = useState(1);
  const [rangeParams, setRangeParams] = useState<{
    start?: number;
    stop: number;
    step?: number;
  }>({ stop: 5 });

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArrayStr(e.target.value);
  };

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

  
  const setCountFn: InputNumberProps['onChange'] = (value) => {
          if (typeof value === 'number') {
              setCount(value);
          }
      };

  const updateRangeParam = (key: 'start' | 'stop' | 'step', value: number | null) => {
    setRangeParams((prev) => ({
      ...prev,
      [key]: value !== null ? value : undefined,
    }));
  };

  useEffect(() => {
    const getRule = () => {
      switch (mock) {
        case '1':
        case '+1':
          return {
            [`${name}|${mock}`]: arrayStr
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          };

        case 'min-max':
          return {
            [`${name}|${interval.join('-')}`]: arrayStr
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          };

        case 'count':
          return {
            [`${name}|${count}`]: arrayStr
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          };

        case 'range':
          const params = [];
          if (rangeParams.start !== undefined) params.push(rangeParams.start);
          params.push(rangeParams.stop);
          if (rangeParams.step !== undefined) params.push(rangeParams.step);

          return {
            [name]: `@range(${params.join(',')})`,
            _params: rangeParams, // 保留原始参数供预览使用
          };

        default:
          return {};
      }
    };

    onChange?.(getRule());
  }, [name, mock, arrayStr, interval, count, rangeParams]);

  return (
    <div style={{ margin: '16px 0' }}>
      {mock === '1' && (
        <>
          <Alert
            message="随机选取模式"
            description="从输入的数组中随机选取一个元素作为结果"
            type="info"
            style={{ marginBottom: 16 }}
          />
          <Input
            value={arrayStr}
            onChange={handleArrayChange}
            placeholder="输入数组项，用逗号分隔（例：苹果,香蕉,橙子）"
          />
        </>
      )}

      {mock === '+1' && (
        <>
          <Alert
            message="顺序选取模式"
            description="从输入的数组中按顺序选取一个元素作为结果"
            type="info"
            style={{ marginBottom: 16 }}
          />
          <Input
            value={arrayStr}
            onChange={handleArrayChange}
            placeholder="输入数组项，用逗号分隔（例：周一,周二,周三）"
          />
        </>
      )}

      {mock === 'min-max' && (
        <>
          <Alert
            message="重复范围模式"
            description="输入基础数组项，系统将根据min和max值生成重复次数范围"
            type="info"
            style={{ marginBottom: 16 }}
          />
          <Input
            value={arrayStr}
            onChange={handleArrayChange}
            placeholder="输入基础数组项，用逗号分隔"
          />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <InputNumber min={1} value={interval[0]} onChange={setIntervalMin} />
            <span>-</span>
            <InputNumber min={interval[0]} value={interval[1]} onChange={setIntervalMax} />
          </div>
        </>
      )}

      {mock === 'count' && (
        <>
          <Alert
            message="固定重复次数模式"
            description="输入基础数组项和重复次数，系统将生成固定次数的重复数组"
            type="info"
            style={{ marginBottom: 16 }}
          />
          <Input
            value={arrayStr}
            onChange={handleArrayChange}
            placeholder="输入基础数组项，用逗号分隔"
          />
          <div style={{ marginTop: 8 }}>
            <InputNumber min={1} value={count} onChange={setCountFn} />
          </div>
        </>
      )}

      {mock === 'range' && (
        <div>
          <Alert
            message="数字范围模式"
            description="根据输入的起始值、结束值和步长生成数字范围数组"
            type="info"
            style={{ marginBottom: 16 }}
          />
          <div className="range-controls" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <InputNumber
              placeholder="start"
              onChange={(v) => updateRangeParam('start', v as number)}
              style={{ width: 120 }}
            />
            <InputNumber
              placeholder="stop *"
              required
              min={rangeParams.start !== undefined ? rangeParams.start + 1 : undefined}
              value={rangeParams.stop}
              onChange={(v) => updateRangeParam('stop', v)}
              style={{ width: 120 }}
            />
            <InputNumber
              placeholder="step"
              min={1}
              onChange={(v) => updateRangeParam('step', v)}
              style={{ width: 120 }}
            />
          </div>
          <div style={{ marginTop: 8, color: '#666' }}>
            当前规则：@range(
            {rangeParams.start !== undefined && <span>{rangeParams.start}, </span>}
            {rangeParams.stop}
            {rangeParams.step !== undefined && <span>, {rangeParams.step}</span>})
          </div>
        </div>
      )}
    </div>
  );
};

export default MockArray;
