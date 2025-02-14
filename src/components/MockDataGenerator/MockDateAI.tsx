import React, { useState, useEffect } from 'react';
import { Input, Alert } from 'antd';

const MockDate: React.FC<{
    name: string;
    mock: string;
    onChange?: (mock: any) => void;
}> = ({ name, mock, onChange }) => {
    const [datePattern, setDatePattern] = useState('yyyy-MM-dd');
    const [timePattern, setTimePattern] = useState('A HH:mm:ss');
    const [datetimePattern, setDatetimePattern] = useState('yyyy-MM-dd A HH:mm:ss');

    const generateRule = () => {
        switch (mock) {
            case 'date':
                return { [name]: `@date(${datePattern})` };
            case 'time':
                return { [name]: `@time(${timePattern})` };
            case 'datetime':
                return { [name]: `@datetime(${datetimePattern})` };
            case 'now':
                return { [name]: '@now' };
            default:
                return {};
        }
    };

    useEffect(() => {
        onChange?.(generateRule());
    }, [name, mock, datePattern, timePattern, datetimePattern]);

    return (
        <div style={{ margin: '16px 0' }}>
            {mock === 'date' && (
                <div>
                    <Alert
                        message="日期模式"
                        description={
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
                        }
                        type="info"
                        style={{ marginBottom: 16 }}
                    />
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span>日期格式：</span>
                        <Input
                            value={datePattern}
                            onChange={(e) => setDatePattern(e.target.value)}
                            style={{ width: 200 }}
                        />
                    </div>
                </div>
            )}

            {mock === 'time' && (
                <div>
                    <Alert
                        message="时间模式"
                        description={
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
                        }
                        type="info"
                        style={{ marginBottom: 16 }}
                    />
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span>时间格式：</span>
                        <Input
                            value={timePattern}
                            onChange={(e) => setTimePattern(e.target.value)}
                            style={{ width: 200 }}
                        />
                    </div>
                </div>
            )}

            {mock === 'datetime' && (
                <div>
                    <Alert
                        message="日期时间模式"
                        description={
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
                        }
                        type="info"
                        style={{ marginBottom: 16 }}
                    />
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span>日期时间格式：</span>
                        <Input
                            value={datetimePattern}
                            onChange={(e) => setDatetimePattern(e.target.value)}
                            style={{ width: 200 }}
                        />
                    </div>
                </div>
            )}

            {mock === 'now' && <Alert message="当前时间模式" description="生成最新时间" type="info" />}

            <div style={{ marginTop: 16, color: '#666' }}>
                <pre>
                    {mock === 'date'
                        ? `@date(${datePattern})`
                        : mock === 'time'
                        ? `@time(${timePattern})`
                        : mock === 'datetime'
                        ? `@datetime(${datetimePattern})`
                        : mock === 'now'
                        ? '@now'
                        : ''}
                </pre>
            </div>
        </div>
    );
};

export default MockDate;
