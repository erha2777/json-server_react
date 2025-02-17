import React, { useState, useCallback, useEffect } from 'react';
// import type { InputNumberProps } from 'antd';
import { Input, InputNumber, Alert, Row, Col, Tag } from 'antd';

// 类型定义
type StringMode = 'min-max' | 'count';
type Interval = [number, number];

const MockString: React.FC<{
  name: string;
  mock: StringMode;
  onChange?: (mock: Record<string, any>) => void;
}> = ({ name, mock, onChange }) => {
  // 集成化状态管理
  const [state, setState] = useState<{
    baseString: string;
    interval: Interval;
    count: number;
  }>({
    baseString: '',
    interval: [1, 5], // 默认范围
    count: 3,         // 默认重复次数
  });

  // 生成规则预览
  const generatePreview = useCallback(() => {
    const { baseString, interval, count } = state;
    if (!baseString) return '等待输入...';

    return mock === 'min-max' 
      ? `${baseString} `.repeat(interval[1]).trim()
      : `${baseString} `.repeat(count).trim();
  }, [state, mock]);

  // 生成Mock规则
  const generateRule = useCallback(() => {
    const { baseString, interval, count } = state;
    // if (!baseString.trim()) return;

    return mock === 'min-max'
      ? { [`${name}|${interval.join('-')}`]: baseString }
      : { [`${name}|${count}`]: baseString };
  }, [name, mock, state]);

  // 输入验证
  const validateInterval = (value: number | null, index: 0 | 1): Interval => {
    const newInterval = [...state.interval] as Interval;
    const numValue = Math.max(1, Math.min(10, Number(value) || 1));
    
    if (index === 0) {
      newInterval[0] = Math.min(numValue, newInterval[1]);
    } else {
      newInterval[1] = Math.max(numValue, newInterval[0]);
    }
    
    return newInterval;
  };

  // 处理状态更新
  const handleChange = {
    baseString: (e: React.ChangeEvent<HTMLInputElement>) => {
      setState(prev => ({ ...prev, baseString: e.target.value }));
    },
    interval: (value: number | null, index: 0 | 1) => {
      setState(prev => ({
        ...prev,
        interval: validateInterval(value, index)
      }));
    },
    count: (value: number | null) => {
      const numValue = Math.max(1, Math.min(10, Number(value) || 1));
      setState(prev => ({ ...prev, count: numValue }));
    }
  };

  // 规则变化时触发回调
  useEffect(() => {
    const rule = generateRule();
    onChange?.(rule || {});
  }, [generateRule]);

  return (
    <div className="mock-string-container" style={{ margin: '16px 0' }}>
      <Alert
        message="操作指南"
        description={
          mock === 'min-max' 
            ? "设置重复次数的随机范围，生成可变长度字符串"
            : "设置固定重复次数，生成确定长度字符串"
        }
        type="info"
        showIcon
      />

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={mock === 'min-max' ? 12 : 18}>
          <Input
            value={state.baseString}
            onChange={handleChange.baseString}
            placeholder="输入基础字符串"
            allowClear
          />
        </Col>

        {mock === 'min-max' ? (
          <Col span={12}>
            <div style={{ display: 'flex', gap: 8 }}>
              <InputNumber
                min={1}
                max={state.interval[1]}
                value={state.interval[0]}
                onChange={(v) => handleChange.interval(v, 0)}
                style={{ width: '100%' }}
                placeholder="最小值"
              />
              <span style={{ lineHeight: '32px' }}>-</span>
              <InputNumber
                min={state.interval[0]}
                max={10}
                value={state.interval[1]}
                onChange={(v) => handleChange.interval(v, 1)}
                style={{ width: '100%' }}
                placeholder="最大值"
              />
            </div>
          </Col>
        ) : (
          <Col span={6}>
            <InputNumber
              min={1}
              max={10}
              value={state.count}
              onChange={handleChange.count}
              style={{ width: '100%' }}
              placeholder="重复次数"
            />
          </Col>
        )}
      </Row>

      <div style={{ marginTop: 16 }}>
        <Tag color="blue">规则预览</Tag>
        <code>
          {name} | 
          {mock === 'min-max' 
            ? `${state.interval[0]}-${state.interval[1]}` 
            : state.count} : 
          "{state.baseString || '<空字符串>'}"
        </code>
      </div>

      <div style={{ marginTop: 8 }}>
        <Tag color="geekblue">示例输出</Tag>
        <div style={{ 
          padding: 8,
          background: '#fafafa',
          borderRadius: 4,
          minHeight: 32
        }}>
          {generatePreview() || '输入内容后预览'}
        </div>
      </div>
    </div>
  );
};

export default MockString;