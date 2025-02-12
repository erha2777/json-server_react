import React, { useState } from 'react';
import { Button, Form, Input, Select, Table } from 'antd';
import Mock from 'mockjs';

const { Option } = Select;

// 定义字段类型
interface Field {
    name: string;
    type: string;
}

// 定义生成的 Mock 数据类型
interface MockData {
    [key: string]: any;
}

interface MockDataGeneratorProps {
    mock: any[];
    // 其他属性
}
const MockString: React.FC<{ mock: string }> = ({ mock }) => {
    return <>{'字符串'+mock}</>;
};

const MockDataGenerator: React.FC<MockDataGeneratorProps> = ({ mock }) => {
    const [fields, setFields] = useState<Field[]>([]);
    const [mockData, setMockData] = useState<MockData[]>([]);

    let content;
    if (mock[0] === 'String') {
        content = <MockString mock={mock[1]}></MockString>;
    }

    return <>{content}</>;
};

export default MockDataGenerator;
