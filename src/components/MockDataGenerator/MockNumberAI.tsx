import React, { useState, useEffect } from 'react';
import { InputNumber } from 'antd';

interface MockNumberProps {
  name: string;
  mock: string;
  onChange?: (mock: any) => void;
}

const MockNumber: React.FC<MockNumberProps> = ({ name, mock, onChange }) => {
  // 递增模式
  const [incrementStart, setIncrementStart] = useState(1);
  
  // 整数范围模式
  const [integerRange, setIntegerRange] = useState([1, 10]);
  
  // 小数范围模式
  const [decimalConfig, setDecimalConfig] = useState({
    intRange: [1, 10],
    decimalRange: [1, 2]
  });

  // 生成最终的 mock 规则
  const generateRule = () => {
    try {
      let rule;
      let value;

      switch (mock) {
        case '+1':
          rule = `${name}|+1`;
          value = incrementStart;
          break;
          
        case 'min-max':
          rule = `${name}|${integerRange[0]}-${integerRange[1]}`;
          value = 1; // mockjs 中这个值仅用于类型判断
          break;
          
        case 'min-max.dmin-dmax':
          rule = `${name}|${decimalConfig.intRange[0]}-${decimalConfig.intRange[1]}.${decimalConfig.decimalRange[0]}-${decimalConfig.decimalRange[1]}`;
          value = 1.0; // mockjs 中这个值仅用于类型判断
          break;
      }

      return { [rule as string]: value };
    } catch (err) {
      return {};
    }
  };

  // 值变化时触发回调
  useEffect(() => {
    onChange?.(generateRule());
  }, [incrementStart, integerRange, decimalConfig]);

  return (
    <div>
      {/* 递增模式 */}
      {mock === '+1' && (
        <div>
          <p>'name|+1': number<br />数字自动递增，初始值：</p>
          <InputNumber
            min={1}
            value={incrementStart}
            onChange={val => setIncrementStart(val as number)}
          />
          <div style={{ marginTop: 8 }}>
            {name} | +1 : {incrementStart}
          </div>
        </div>
      )}

      {/* 整数范围模式 */}
      {mock === 'min-max' && (
        <div>
          <p>'name|min-max': number<br />整数范围：</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <InputNumber
              min={1}
              value={integerRange[0]}
              onChange={val => setIntegerRange([val as number, integerRange[1]])}
            />
            <span>-</span>
            <InputNumber
              min={integerRange[0]}
              value={integerRange[1]}
              onChange={val => setIntegerRange([integerRange[0], val as number])}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            {name} | {integerRange[0]}-{integerRange[1]} : 1
          </div>
        </div>
      )}

      {/* 小数范围模式 */}
      {mock === 'min-max.dmin-dmax' && (
        <div>
          <p>'name|min-max.dmin-dmax': number<br />整数和小数范围：</p>
          
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span>整数部分：</span>
            <InputNumber
              min={1}
              value={decimalConfig.intRange[0]}
              onChange={val => setDecimalConfig({
                ...decimalConfig,
                intRange: [val as number, decimalConfig.intRange[1]]
              })}
            />
            <span>-</span>
            <InputNumber
              min={decimalConfig.intRange[0]}
              value={decimalConfig.intRange[1]}
              onChange={val => setDecimalConfig({
                ...decimalConfig,
                intRange: [decimalConfig.intRange[0], val as number]
              })}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <span>小数位数：</span>
            <InputNumber
              min={1}
              value={decimalConfig.decimalRange[0]}
              onChange={val => setDecimalConfig({
                ...decimalConfig,
                decimalRange: [val as number, decimalConfig.decimalRange[1]]
              })}
            />
            <span>-</span>
            <InputNumber
              min={decimalConfig.decimalRange[0]}
              value={decimalConfig.decimalRange[1]}
              onChange={val => setDecimalConfig({
                ...decimalConfig,
                decimalRange: [decimalConfig.decimalRange[0], val as number]
              })}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            {name} | {decimalConfig.intRange[0]}-{decimalConfig.intRange[1]}.
            {decimalConfig.decimalRange[0]}-{decimalConfig.decimalRange[1]} : 1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default MockNumber;