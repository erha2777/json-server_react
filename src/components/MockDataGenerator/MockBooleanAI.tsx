import React, { useState, useEffect } from 'react';
import { InputNumber, Radio, Alert, Tag } from 'antd';
import type { MockDataGeneratorType } from '@/components/MockDataGeneratorModal/index';

interface MockBooleanProps {
    name: string;
    mock: string;
    onChange?: (data: MockDataGeneratorType) => void;
}

const MockBoolean: React.FC<MockBooleanProps> = ({ name, mock, onChange }) => {
    const [booleanVal, setBoolean] = useState(true);
    const [interval, setInterval] = useState([1, 1]);

    // 生成规则预览
    const generatePreview = () => {
        if (mock === '1') {
            return `${name}|1 : ${booleanVal}`;
        } else if (mock === 'min-max') {
            return `${name}|${interval[0]}-${interval[1]} : ${booleanVal}`;
        }
        return '';
    };

    // 生成Mock规则
    const generateRule = () => {
        if (mock === '1') {
            return { [`${name}|1`]: booleanVal };
        } else if (mock === 'min-max') {
            // const probability = interval[0] / (interval[0] + interval[1]);
            return {
                [`${name}|${interval[0]}-${interval[1]}`]: booleanVal,
                // _probability: probability
            };
        }
        return {};
    };

    // 更新规则
    const updateRule = () => {
        const rule = generateRule();
        onChange?.({ mock: rule });
    };

    // 监听状态变化，更新规则
    useEffect(() => {
        updateRule();
    }, [booleanVal, interval, mock, name]);

    // 处理输入变化
    const handleIntervalChange = (value: number | null, index: 0 | 1) => {
        const newInterval = [...interval];
        if (typeof value === 'number') {
            newInterval[index] = Math.max(1, value);
            if (index === 1 && newInterval[0] > newInterval[1]) {
                newInterval[1] = newInterval[0];
            }
            setInterval(newInterval);
        }
    };

    return (
        <div style={{ margin: '16px 0' }}>
            {mock === '1' && (
                <Alert message="1:1 模式" description={`${name}|1 表示true/false各50%概率`} type="info" showIcon />
            )}

            {mock === 'min-max' && (
                <div>
                    <Alert
                        message="比例模式"
                        description="输入比例值，系统会自动计算概率（例如2:3表示40% true）"
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Radio.Group
                            value={booleanVal}
                            onChange={(e) => setBoolean(e.target.value)}
                            options={[
                                { value: true, label: 'true' },
                                { value: false, label: 'false' },
                            ]}
                        />
                        <InputNumber
                            min={1}
                            value={interval[0]}
                            onChange={(v) => handleIntervalChange(v, 0)}
                            style={{ width: '80px' }}
                        />
                        <span>-</span>
                        <InputNumber
                            min={1}
                            value={interval[1]}
                            onChange={(v) => handleIntervalChange(v, 1)}
                            style={{ width: '80px' }}
                        />
                    </div>
                </div>
            )}

            {/* 预览区域 */}
            <div style={{ marginTop: 16 }}>
                <Tag color="blue">规则预览</Tag>
                <code>{generatePreview()}</code>
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
                    {mock === '1'
                        ? Math.random() > 0.5
                            ? 'true'
                            : 'false'
                        : Math.random() < interval[0] / (interval[0] + interval[1])
                        ? 'true'
                        : 'false'}
                </div>
            </div>
        </div>
    );
};

export default MockBoolean;
