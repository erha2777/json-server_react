import React, { useState, useCallback, useEffect } from 'react';
import { Input, InputNumber, Alert, Row, Col, Tag } from 'antd';
import Mock from 'mockjs';

type TextMode = 'cparagraph' | 'csentence' | 'cword' | 'ctitle' | 'paragraph' | 'sentence' | 'word' | 'title';

const TextMock: React.FC<{
  name: string;
  mock: TextMode;
  onChange?: (mock: Record<string, any>) => void;
}> = ({ name, mock, onChange }) => {
  const [state, setState] = useState<{
    min: number;
    max: number;
    pool?: string;
  }>({
    min: 1,
    max: 5,
    pool: undefined,
  });

  const generatePreview = useCallback(() => {
    const { min, max, pool } = state;
    let preview = '';

    switch (mock) {
      case 'cparagraph':
        preview = Mock.mock(`@cparagraph(${min},${max})`);
        break;
      case 'csentence':
        preview = Mock.mock(`@csentence(${min},${max})`);
        break;
      case 'cword':
        preview = Mock.mock(`@cword(${pool || '默认字符池'},${min},${max})`);
        break;
      case 'ctitle':
        preview = Mock.mock(`@ctitle(${min},${max})`);
        break;
      case 'paragraph':
        preview = Mock.mock(`@paragraph(${min},${max})`);
        break;
      case 'sentence':
        preview = Mock.mock(`@sentence(${min},${max})`);
        break;
      case 'word':
        preview = Mock.mock(`@word(${min},${max})`);
        break;
      case 'title':
        preview = Mock.mock(`@title(${min},${max})`);
        break;
      default:
        preview = '无效的mock类型';
    }

    return preview;
  }, [state, mock]);

  const generateRule = useCallback(() => {
    const { min, max, pool } = state;
    const ruleKey = `${name}|${min}-${max}${pool ? `|pool=${pool}` : ''}`;
    
    return {
      [ruleKey]: mock === 'cword' && pool ? `@cword(${pool},${min},${max})` : `@${mock}(${min},${max})`
    };
  }, [name, mock, state]);

  const validateRange = (value: number | null, index: 0 | 1): [number, number] => {
    const newMin = Math.max(1, Math.min(100, Number(value) || 1));
    const newMax = index === 0 ? Math.max(newMin, state.max) : Math.max(newMin, state.min);
    
    if (index === 0) {
      return [newMin, Math.max(newMin, state.max)];
    } else {
      return [Math.min(newMax, state.min), newMax];
    }
  };

  const handleChange = {
    min: (value: number | null) => {
      const [newMin, newMax] = validateRange(value, 0);
      setState(prev => ({ ...prev, min: newMin, max: newMax }));
    },
    max: (value: number | null) => {
      const [newMin, newMax] = validateRange(value, 1);
      setState(prev => ({ ...prev, min: newMin, max: newMax }));
    },
    pool: (e: React.ChangeEvent<HTMLInputElement>) => {
      setState(prev => ({ ...prev, pool: e.target.value }));
    }
  };

  useEffect(() => {
    const rule = generateRule();
    onChange?.(rule || {});
  }, [generateRule]);

  return (
    <div className="text-mock-container" style={{ margin: '16px 0' }}>
      <Alert
        message="操作指南"
        description={
          mock === 'cword' 
            ? "设置生成范围和可选字符池，生成随机中文单词"
            : "设置生成范围，生成随机文本"
        }
        type="info"
        showIcon
      />

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={mock === 'cword' ? 12 : 24}>
          {mock === 'cword' && (
            <>
              <Input
                value={state.pool || '默认字符池'}
                onChange={handleChange.pool}
                placeholder="输入可选字符池（可选）"
                allowClear
                style={{ marginBottom: 8 }}
              />
            </>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <InputNumber
              min={1}
              max={100}
              value={state.min}
              onChange={handleChange.min}
              style={{ width: '100%' }}
              placeholder="最小值"
            />
            <span style={{ lineHeight: '32px' }}>-</span>
            <InputNumber
              min={1}
              max={100}
              value={state.max}
              onChange={handleChange.max}
              style={{ width: '100%' }}
              placeholder="最大值"
            />
          </div>
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        <Tag color="blue">规则预览</Tag>
        <code>
          {name} | 
          {mock === 'cword' 
            ? `${state.min}-${state.max}${state.pool ? `|pool=${state.pool}` : ''}`
            : `${state.min}-${state.max}`}
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
          {generatePreview()}
        </div>
      </div>
    </div>
  );
};

export default TextMock;
