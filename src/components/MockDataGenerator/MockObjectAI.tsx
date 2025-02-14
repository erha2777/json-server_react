import React, { useState, useEffect } from 'react';
import type { InputNumberProps } from 'antd';
import { InputNumber, Alert, Input } from 'antd';

const MockObject: React.FC<{ 
  name: string;
  mock: string;
  onChange?: (mock: any) => void 
}> = ({ name, mock, onChange }) => {
  // 对象属性状态（格式：key:value 逗号分隔）
  const [objectProps, setObjectProps] = useState('');
  // 数量范围状态
  const [count, setCount] = useState(1);
  const [interval, setInterval] = useState([1, 1]);

  // 解析对象属性
  const parseProperties = () => {
    return objectProps.split(',')
      .map(pair => pair.trim().split(':'))
      .filter(([key]) => key)
      .reduce((acc: Record<string, string>, [key, value]) => {
        acc[key.trim()] = (value || '').trim();
        return acc;
      }, {});
  };

  useEffect(() => {
    const generateRule = () => {
      const properties = parseProperties();
      
      if (mock === 'count') {
        return { [`${name}|${count}`]: properties };
      }
      
      if (mock === 'min-max') {
        return { [`${name}|${interval[0]}-${interval[1]}`]: properties };
      }
      
      return {};
    };

    onChange?.(generateRule());
  }, [name, mock, objectProps, count, interval]);

  return (
    <div style={{ margin: '16px 0' }}>
      <div style={{ marginBottom: 16 }}>
        <Alert
          message="输入格式要求"
          description={
            <div>
              <p>使用英文逗号分隔属性，每个属性格式：</p>
              <code>key:value</code>
              <p>示例：name:John,age:30,gender:male</p>
            </div>
          }
          type="info"
          showIcon
        />
        <Input.TextArea
          rows={3}
          value={objectProps}
          onChange={(e) => setObjectProps(e.target.value)}
          placeholder="输入对象属性..."
          style={{ marginTop: 8 }}
        />
      </div>

      {mock === 'count' && (
        <div>
          <p>选择属性数量：</p>
          <InputNumber
            min={1}
            max={Object.keys(parseProperties()).length}
            value={count}
            onChange={(v) => setCount(Number(v) || 1)}
          />
          <span style={{ marginLeft: 8 }}>
            当前对象共 {Object.keys(parseProperties()).length} 个属性
          </span>
        </div>
      )}

      {mock === 'min-max' && (
        <div>
          <p>选择属性数量范围：</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <InputNumber
              min={1}
              max={Object.keys(parseProperties()).length}
              value={interval[0]}
              onChange={(v) => setInterval([Number(v) || 1, interval[1]])}
            />
            <span>至</span>
            <InputNumber
              min={interval[0]}
              max={Object.keys(parseProperties()).length}
              value={interval[1]}
              onChange={(v) => setInterval([interval[0], Number(v) || interval[0] + 1])}
            />
          </div>
          <div style={{ color: '#666', marginTop: 8 }}>
            有效范围：1 - {Object.keys(parseProperties()).length}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5' }}>
        <h4>实时预览：</h4>
        <pre>
          {JSON.stringify(parseProperties(), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default MockObject;