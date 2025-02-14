import React, { useState, useEffect } from 'react';
import { InputNumber, Alert } from 'antd';

interface MockNumberProps {
    name: string;
    mock: string;
    onChange?: (mock: any) => void;
}

const MockNumber: React.FC<MockNumberProps> = ({ name, mock, onChange }) => {
    const [incrementStart, setIncrementStart] = useState(1);
    const [integerRange, setIntegerRange] = useState([1, 10]);
    const [decimalConfig, setDecimalConfig] = useState({
        intRange: [1, 10],
        decimalRange: [1, 2],
    });
    const [preview, setPreview] = useState('');

    const generateRule = () => {
        try {
            let rule;
            let value;
            let preview;

            switch (mock) {
                case '+1':
                    rule = `${name}|+1`;
                    value = incrementStart;
                    preview = `${name} | +1 : ${incrementStart}`;
                    break;

                case 'min-max':
                    rule = `${name}|${integerRange[0]}-${integerRange[1]}`;
                    value = 1;
                    preview = `${name} | ${integerRange[0]}-${integerRange[1]} : 1`;
                    break;

                case 'min-max.dmin-dmax':
                    rule = `${name}|${decimalConfig.intRange[0]}-${decimalConfig.intRange[1]}.${decimalConfig.decimalRange[0]}-${decimalConfig.decimalRange[1]}`;
                    value = 1.0;
                    preview = `${name} | ${decimalConfig.intRange[0]}-${decimalConfig.intRange[1]}.${decimalConfig.decimalRange[0]}-${decimalConfig.decimalRange[1]} : 1.0`;
                    break;

                default:
                    return { rule: {}, preview: '' };
            }

            return { rule: { [rule]: value }, preview };
        } catch (err) {
            return { rule: {}, preview: '' };
        }
    };

    useEffect(() => {
        const { rule, preview } = generateRule();
        onChange?.(rule);
        setPreview(preview);
    }, [incrementStart, integerRange, decimalConfig, name, mock]);

    const renderInput = () => {
        switch (mock) {
            case '+1':
                return (
                    <div style={{ margin: '16px 0' }}>
                        <Alert
                            message="递增"
                            description="'name|+1': number  属性值自动加 1，初始值为 number。"
                            type="info"
                            style={{ marginBottom: 16 }}
                        />
                        <InputNumber
                            min={1}
                            value={incrementStart}
                            onChange={(val) => setIncrementStart(val as number)}
                        />
                    </div>
                );

            case 'min-max':
                return (
                    <div style={{ margin: '16px 0' }}>
                        <Alert
                            message="整数（范围中随机）"
                            description="生成一个大于等于 min、小于等于 max 的整数"
                            type="info"
                            style={{ marginBottom: 16 }}
                        />
                        <div style={{ display: 'flex', gap: 8 }}>
                            <InputNumber
                                min={1}
                                value={integerRange[0]}
                                onChange={(val) => setIntegerRange([val as number, integerRange[1]])}
                            />
                            <span>-</span>
                            <InputNumber
                                min={integerRange[0]}
                                value={integerRange[1]}
                                onChange={(val) => setIntegerRange([integerRange[0], val as number])}
                            />
                        </div>
                    </div>
                );

            case 'min-max.dmin-dmax':
                return (
                    <div style={{ margin: '16px 0' }}>
                        <Alert
                            message="小数（范围中随机）"
                            description="生成一个浮点数，整数部分大于等于 min、小于等于 max，小数部分保留 dmin 到 dmax 位。"
                            type="info"
                            style={{ marginBottom: 16 }}
                        />
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <span>整数部分：</span>
                            <InputNumber
                                min={1}
                                value={decimalConfig.intRange[0]}
                                onChange={(val) =>
                                    setDecimalConfig({
                                        ...decimalConfig,
                                        intRange: [val as number, decimalConfig.intRange[1]],
                                    })
                                }
                            />
                            <span>-</span>
                            <InputNumber
                                min={decimalConfig.intRange[0]}
                                value={decimalConfig.intRange[1]}
                                onChange={(val) =>
                                    setDecimalConfig({
                                        ...decimalConfig,
                                        intRange: [decimalConfig.intRange[0], val as number],
                                    })
                                }
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                            <span>小数位数：</span>
                            <InputNumber
                                min={1}
                                value={decimalConfig.decimalRange[0]}
                                onChange={(val) =>
                                    setDecimalConfig({
                                        ...decimalConfig,
                                        decimalRange: [val as number, decimalConfig.decimalRange[1]],
                                    })
                                }
                            />
                            <span>-</span>
                            <InputNumber
                                min={decimalConfig.decimalRange[0]}
                                value={decimalConfig.decimalRange[1]}
                                onChange={(val) =>
                                    setDecimalConfig({
                                        ...decimalConfig,
                                        decimalRange: [decimalConfig.decimalRange[0], val as number],
                                    })
                                }
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div>
            {renderInput()}
            <div style={{ marginTop: 16, border: '1px solid #ddd', padding: '8px', borderRadius: '4px' }}>
                <p style={{ margin: 0, color: '#666' }}>预览:</p>
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{preview}</div>
            </div>
        </div>
    );
};

export default MockNumber;
