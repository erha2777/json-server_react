import React, { useState, useCallback, useEffect } from 'react';
import { Input, Alert, Row, Col, Tag } from 'antd';
import type { MockDataGeneratorType } from '@/components/MockDataGeneratorModal/index';

// 类型定义
type PathMode = 'absolute' | 'relative';

const MockPath: React.FC<{
    name: string;
    mock: PathMode;
    onChange?: (data: MockDataGeneratorType) => void;
}> = ({ name, mock, onChange }) => {
    // 集成化状态管理
    const [state, setState] = useState<{
        prefix: string;
        pathContent: string;
    }>({
        prefix: '@/',
        pathContent: 'nested/a/b/c',
    });

    // 生成规则预览
    const generatePreview = useCallback(() => {
        const { prefix, pathContent } = state;
        if (!pathContent) return '等待输入...';

        return `${prefix}${pathContent}`;
    }, [state]);

    // 生成Mock规则
    const generateRule = useCallback(() => {
        const { prefix, pathContent } = state;
        if (!pathContent.trim()) return;

        return {
            [`${name}|${mock}|${prefix}`]: pathContent,
        };
    }, [name, mock, state]);

    // 处理状态更新
    const handleChange = {
        prefix: (e: React.ChangeEvent<HTMLInputElement>) => {
            setState((prev) => ({ ...prev, prefix: e.target.value }));
        },
        pathContent: (e: React.ChangeEvent<HTMLInputElement>) => {
            setState((prev) => ({ ...prev, pathContent: e.target.value }));
        },
    };

    // 规则变化时触发回调
    useEffect(() => {
        const rule = generateRule();
        onChange?.({
            mock: rule || {},
        });
    }, [generateRule]);

    return (
        <div className="mock-path-container" style={{ margin: '16px 0' }}>
            <Alert
                message="操作指南"
                description={
                    mock === 'absolute'
                        ? '设置绝对路径前缀和路径内容，生成绝对路径'
                        : '设置相对路径前缀和路径内容，生成相对路径'
                }
                type="info"
                showIcon
            />

            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                    <Input
                        value={state.prefix}
                        onChange={handleChange.prefix}
                        placeholder="输入路径前缀（如 @/ 或 @../../）"
                        allowClear
                    />
                </Col>

                <Col span={12}>
                    <Input
                        value={state.pathContent}
                        onChange={handleChange.pathContent}
                        placeholder="输入路径内容（如 nested/a/b/c）"
                        allowClear
                    />
                </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
                <Tag color="blue">规则预览</Tag>
                <code>
                    {name} | {mock} | {state.prefix} : "{state.pathContent || '<空路径>'}"
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
                    {generatePreview() || '输入内容后预览'}
                </div>
            </div>
        </div>
    );
};

export default MockPath;
