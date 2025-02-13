import React from 'react';
// import Mock from 'mockjs';
import MockString from './MockString';
import MockNumber from './MockNumber';
import MockBoolean from './MockBoolean';
import MockObject from './MockObject';
interface MockDataGeneratorProps {
    mock: any[];
    name: string;
    // 其他属性
}

const MockDataGenerator: React.FC<MockDataGeneratorProps> = ({ mock, name }) => {
    const onChange = (mock: any) => {
        console.debug('mock', mock);
    };

    let content;
    if (mock[0] === 'String') {
        content = <MockString mock={mock[1]} name={name} onChange={onChange}></MockString>;
    } else if (mock[0] === 'Number') {
        content = <MockNumber mock={mock[1]} name={name} onChange={onChange}></MockNumber>;
    } else if (mock[0] === 'Boolean') {
        content = <MockBoolean mock={mock[1]} name={name} onChange={onChange}></MockBoolean>;
    } else if (mock[0] === 'Object') {
        content = <MockObject mock={mock[1]} name={name} onChange={onChange}></MockObject>;
    }

    return <>{content}</>;
};

export default MockDataGenerator;
