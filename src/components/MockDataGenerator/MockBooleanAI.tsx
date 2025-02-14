import React, { useState, useEffect } from 'react';
import { InputNumber, Alert } from 'antd';

const MockBoolean: React.FC<{ 
  name: string;
  mock: string;
  onChange?: (mock: any) => void 
}> = ({ name, mock, onChange }) => {
  // 比例模式状态
  const [ratio, setRatio] = useState({ trueRatio: 1, falseRatio: 1 });
  
  // 计算概率（保留两位小数）
  const calcProbability = (): number => {
    const total = ratio.trueRatio + ratio.falseRatio;
    return total === 0 ? 0.5 : ratio.trueRatio / total;
  };

  useEffect(() => {
    const generateRule = () => {
      if (mock === '1') {
        return { [`${name}|1`]: true }; // Mock.js标准语法
      }
      
      if (mock === 'min-max') {
        return { 
          [name]: true,
          _probability: calcProbability() // 实际生成规则需要根据Mock.js语法调整
        };
      }
      
      return {};
    };

    onChange?.(generateRule());
  }, [name, mock, ratio]);

  return (
    <div style={{ margin: '16px 0' }}>
      {mock === '1' && (
        <Alert
          message="1:1 模式"
          description={`${name}|1 表示true/false各50%概率`}
          type="info"
        />
      )}

      {mock === 'min-max' && (
        <div>
          <Alert
            message="比例模式"
            description="输入比例值，系统会自动计算概率（例如2:3表示40% true）"
            type="info"
            style={{ marginBottom: 16 }}
          />
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <span>True 比例：</span>
              <InputNumber
                min={0}
                max={100}
                value={ratio.trueRatio}
                onChange={v => setRatio(prev => ({ ...prev, trueRatio: Number(v) || 0 }))}
              />
            </div>
            <div>
              <span>False 比例：</span>
              <InputNumber
                min={0}
                max={100}
                value={ratio.falseRatio}
                onChange={v => setRatio(prev => ({ ...prev, falseRatio: Number(v) || 0 }))}
              />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <span>实际概率：</span>
            <span style={{ color: '#1890ff' }}>
              {calcProbability() * 100}% true / {100 - calcProbability() * 100}% false
            </span>
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, color: '#666' }}>
        <pre>
          {mock === '1' ? 
            `${name}|1 => 随机布尔值` : 
            `${name} @probability(${calcProbability()})`}
        </pre>
      </div>
    </div>
  );
};

export default MockBoolean;