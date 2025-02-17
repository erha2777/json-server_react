import React, { useState, useCallback, useEffect } from 'react';
import { Input, Alert, Row, Col, Tag } from 'antd';

type FunctionMode = 'function';

const MockFunction: React.FC<{
    name: string;
    mock: FunctionMode;
    onChange?: (mock: Record<string, any>) => void;
}> = ({ name, mock, onChange }) => {
    const [state, setState] = useState({
        functionExpression: '',
        error: '',
    });

    const generatePreview = useCallback(() => {
        const { functionExpression } = state;
        if (!functionExpression) return '等待输入...';
        return `function() { ${functionExpression} }`;
    }, [state]);

    const generateRule = useCallback(() => {
        const { functionExpression } = state;
        // if (!functionExpression.trim()) return;

        try {
            // 将函数表达式转换为字符串形式
            const funcStr = `function() { ${functionExpression} }`;
            return { [name]: funcStr };
        } catch (error) {
            console.error('函数表达式无效:', error);
            setState((prev) => ({ ...prev, error: '函数表达式无效，请检查语法或引用是否正确。' }));
            return {};
        }
    }, [name, state]);

    const handleChange = {
        functionExpression: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setState((prev) => ({ ...prev, functionExpression: e.target.value, error: '' }));
        },
    };

    useEffect(() => {
        const rule = generateRule();
        onChange?.(rule || {});
    }, [generateRule]);

    return (
        <div className="mock-function-container" style={{ margin: '16px 0' }}>
            <Alert
                message="操作指南"
                description="输入一个函数表达式，可以引用实例上的其他属性，例如：return this.age;"
                type="info"
                showIcon
            />

            {state.error && <Alert message="错误" description={state.error} type="error" showIcon />}

            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                    <Input.TextArea
                        value={state.functionExpression}
                        onChange={handleChange.functionExpression}
                        placeholder="输入函数表达式，例如：return this.age;"
                        allowClear
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
                <Tag color="blue">规则预览</Tag>
                <code>
                    {name}: {generatePreview()}
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
                    {generatePreview() || '输入函数表达式后预览'}
                </div>
            </div>
        </div>
    );
};

export default MockFunction;
