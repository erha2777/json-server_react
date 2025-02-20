import React, { useState, useCallback, useEffect } from 'react';
import { Input, Alert, Row, Col, Tag } from 'antd';
import Mock from 'mockjs';
import type { MockDataGeneratorType } from '@/components/MockDataGeneratorModal/index';

type DateMode = 'date' | 'time' | 'datetime' | 'now';

const MockDate: React.FC<{
    name: string;
    mock: DateMode;
    onChange?: (data: MockDataGeneratorType) => void;
}> = ({ name, mock, onChange }) => {
    const [state, setState] = useState<{
        datePattern: string;
        timePattern: string;
        datetimePattern: string;
    }>({
        datePattern: 'yyyy-MM-dd',
        timePattern: 'A HH:mm:ss',
        datetimePattern: 'yyyy-MM-dd A HH:mm:ss',
    });

    const generatePreview = useCallback(() => {
        let preview = '';
        switch (mock) {
            case 'date':
                preview = Mock.mock(`@date(${state.datePattern})`);
                break;
            case 'time':
                preview = Mock.mock(`@time(${state.timePattern})`);
                break;
            case 'datetime':
                preview = Mock.mock(`@datetime(${state.datetimePattern})`);
                break;
            case 'now':
                preview = Mock.mock('@now');
                break;
            default:
                preview = '无效的mock类型';
        }
        return preview;
    }, [mock, state.datePattern, state.timePattern, state.datetimePattern]);

    const generateRule = useCallback(() => {
        let ruleKey = `${name}`;
        let ruleValue = `@${mock}`;

        switch (mock) {
            case 'date':
                ruleValue = `@date("${state.datePattern}")`;
                break;
            case 'time':
                ruleValue = `@time("${state.timePattern}")`;
                break;
            case 'datetime':
                ruleValue = `@datetime("${state.datetimePattern}")`;
                break;
            case 'now':
                ruleValue = '@now';
                break;
            default:
                return {};
        }

        return { [ruleKey]: ruleValue };
    }, [name, mock, state.datePattern, state.timePattern, state.datetimePattern]);

    const handleChange = {
        datePattern: (e: React.ChangeEvent<HTMLInputElement>) => {
            setState((prev) => ({ ...prev, datePattern: e.target.value }));
        },
        timePattern: (e: React.ChangeEvent<HTMLInputElement>) => {
            setState((prev) => ({ ...prev, timePattern: e.target.value }));
        },
        datetimePattern: (e: React.ChangeEvent<HTMLInputElement>) => {
            setState((prev) => ({ ...prev, datetimePattern: e.target.value }));
        },
    };

    useEffect(() => {
        const rule = generateRule();
        onChange?.({
            mock: rule || {},
        });
    }, [generateRule]);

    return (
        <div className="mock-date-container" style={{ margin: '16px 0' }}>
            <Alert
                message="操作指南"
                description={
                    mock === 'date' ? (
                        <>
                            <p>输入日期格式，系统将根据格式生成日期</p>
                            <p>常见的日期格式示例：</p>
                            <ul>
                                <li>yyyy-MM-dd（例如：2023-10-20）</li>
                                <li>MM/dd/yyyy（例如：10/20/2023）</li>
                                <li>dd/MM/yyyy（例如：20/10/2023）</li>
                                <li>yyyy年MM月dd日（例如：2023年10月20日）</li>
                            </ul>
                        </>
                    ) : mock === 'time' ? (
                        <>
                            <p>输入时间格式，系统将根据格式生成时间</p>
                            <p>常见的时间格式示例：</p>
                            <ul>
                                <li>A HH:mm:ss（例如：PM 03:45:22）</li>
                                <li>HH:mm:ss（例如：15:45:22）</li>
                                <li>HH:mm（例如：15:45）</li>
                                <li>HH时mm分ss秒（例如：15时45分22秒）</li>
                            </ul>
                        </>
                    ) : mock === 'datetime' ? (
                        <>
                            <p>输入日期时间格式，系统将根据格式生成日期时间</p>
                            <p>常见的日期时间格式示例：</p>
                            <ul>
                                <li>yyyy-MM-dd A HH:mm:ss（例如：2023-10-20 PM 03:45:22）</li>
                                <li>yyyy-MM-dd HH:mm:ss（例如：2023-10-20 15:45:22）</li>
                                <li>MM/dd/yyyy HH:mm:ss（例如：10/20/2023 15:45:22）</li>
                                <li>yyyy年MM月dd日 HH:mm:ss（例如：2023年10月20日 15:45:22）</li>
                            </ul>
                        </>
                    ) : mock === 'now' ? (
                        '生成最新时间'
                    ) : (
                        '无效的mock类型'
                    )
                }
                type="info"
                showIcon
            />

            <Row gutter={16} style={{ marginTop: 16 }}>
                {mock === 'date' && (
                    <Col span={24}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span>日期格式：</span>
                            <Input
                                value={state.datePattern}
                                onChange={handleChange.datePattern}
                                style={{ width: 200 }}
                                placeholder="输入日期格式"
                            />
                        </div>
                    </Col>
                )}

                {mock === 'time' && (
                    <Col span={24}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span>时间格式：</span>
                            <Input
                                value={state.timePattern}
                                onChange={handleChange.timePattern}
                                style={{ width: 200 }}
                                placeholder="输入时间格式"
                            />
                        </div>
                    </Col>
                )}

                {mock === 'datetime' && (
                    <Col span={24}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span>日期时间格式：</span>
                            <Input
                                value={state.datetimePattern}
                                onChange={handleChange.datetimePattern}
                                style={{ width: 200 }}
                                placeholder="输入日期时间格式"
                            />
                        </div>
                    </Col>
                )}
            </Row>

            <div style={{ marginTop: 16 }}>
                <Tag color="blue">规则预览</Tag>
                <code>
                    {name} | @
                    {mock === 'date'
                        ? `date("${state.datePattern}")`
                        : mock === 'time'
                        ? `time("${state.timePattern}")`
                        : mock === 'datetime'
                        ? `datetime("${state.datetimePattern}")`
                        : 'now'}
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

export default MockDate;
