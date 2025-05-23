import React, { useState, useCallback, useEffect } from 'react';
import { Input, Alert, Tag } from 'antd';
import type { MockDataGeneratorType } from '@/components/MockDataGeneratorModal/index';
import Mock from 'mockjs';

const MockRegExp: React.FC<{
    name: string;
    onChange?: (data: MockDataGeneratorType) => void;
    defaultValue?: string;
}> = ({ name, onChange, defaultValue }) => {
    const [state, setState] = useState({
        regex: defaultValue || '',
    });

    // 生成规则预览
    const generatePreview = useCallback(() => {
        const { regex } = state;
        if (!regex) return '等待输入...';
        return `匹配正则表达式: ${Mock.mock(new RegExp(regex))}`;
    }, [state]);

    // 生成Mock规则
    const generateRule = useCallback(() => {
        const { regex } = state;
        // if (!regex.trim()) return;
        return {
            [name]: regex,
        };
    }, [name, state]);

    // 处理状态更新
    const handleChange = {
        regex: (e: React.ChangeEvent<HTMLInputElement>) => {
            setState((prev) => ({ ...prev, regex: e.target.value }));
        },
    };

    // 规则变化时触发回调
    useEffect(() => {
        const rule = generateRule();
        onChange?.({
            mock: rule || {},
            defaultValue: state.regex,
        });
    }, [generateRule]);

    return (
        <div className="mock-regexp-container" style={{ margin: '16px 0' }}>
            <Alert message="操作指南" description="输入正则表达式，生成匹配该正则的字符串，如：[a-z][A-Z][0-9]" type="info" showIcon />

            <Input
                value={state.regex}
                onChange={handleChange.regex}
                placeholder="输入正则表达式"
                allowClear
                style={{ marginTop: 16 }}
            />

            <div style={{ marginTop: 16 }}>
                <Tag color="blue">规则预览</Tag>
                <code>
                    {name} : "{`/${state.regex}/` || '<空正则>'}"
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
                    {generatePreview() || '输入正则表达式后预览'}
                </div>
            </div>
        </div>
    );
};

export default MockRegExp;
