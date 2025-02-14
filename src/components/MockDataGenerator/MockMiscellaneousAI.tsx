import React, { useState, useCallback, useEffect } from 'react';
import { InputNumber, Alert, Row, Col, Tag } from 'antd';
import Mock from 'mockjs';

type MiscellaneousMode = 'guid' | 'id' | 'increment';

const MiscellaneousMock: React.FC<{
    name: string;
    mock: MiscellaneousMode;
    onChange?: (mock: Record<string, any>) => void;
}> = ({ name, mock, onChange }) => {
    const [state, setState] = useState<{
        step?: number;
    }>({
        step: 1,
    });

    const generatePreview = useCallback(() => {
        let preview = '';
        switch (mock) {
            case 'guid':
                preview = Mock.mock('@guid');
                break;
            case 'id':
                preview = Mock.mock('@id');
                break;
            case 'increment':
                preview = Mock.mock(`@increment(${state.step})`);
                break;
            default:
                preview = '无效的mock类型';
        }
        return preview;
    }, [mock, state.step]);

    const generateRule = useCallback(() => {
        const ruleKey = `${name}`;
        const ruleValue = mock === 'increment' ? `@increment(${state.step})` : `@${mock}`;
        return { [ruleKey]: ruleValue };
    }, [name, mock, state.step]);

    const handleChange = {
        step: (value: number | null) => {
            const numValue = Math.max(1, Math.min(100, Number(value) || 1));
            setState((prev) => ({ ...prev, step: numValue }));
        },
    };

    useEffect(() => {
        const rule = generateRule();
        onChange?.(rule || {});
    }, [generateRule, onChange]);

    return (
        <div className="miscellaneous-mock-container" style={{ margin: '16px 0' }}>
            <Alert
                message="操作指南"
                description={mock === 'increment' ? '设置步长，生成增量数值' : '生成对应的其他元素'}
                type="info"
                showIcon
            />

            <Row gutter={16} style={{ marginTop: 16 }}>
                {mock === 'increment' && (
                    <Col span={24}>
                        <InputNumber
                            min={1}
                            max={100}
                            value={state.step}
                            onChange={handleChange.step}
                            style={{ width: '100%' }}
                            placeholder="步长"
                        />
                    </Col>
                )}
            </Row>

            <div style={{ marginTop: 16 }}>
                <Tag color="blue">规则预览</Tag>
                <code>
                    {name} | @{mock === 'increment' ? `${mock}(${state.step})` : mock}
                </code>
            </div>

            <div style={{ marginTop: 8 }}>
                <Tag color="geekblue">示例输出</Tag>
                <div
                    style={{
                        padding: 8,
                        background: '#fafafa',
                        borderRadius: 4,
                        minHeight: 32,
                    }}
                >
                    {generatePreview()}
                </div>
            </div>
        </div>
    );
};

export default MiscellaneousMock;
