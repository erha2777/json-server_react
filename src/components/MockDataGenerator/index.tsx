import React from 'react';
// import Mock from 'mockjs';
// import MockString from './MockString';
import MockString from './MockStringAI';
// import MockNumber from './MockNumber';
import MockNumber from './MockNumberAI';
// import MockBoolean from './MockBoolean';
import MockBoolean from './MockBooleanAI';
// import MockObject from './MockObject';
import MockObject from './MockObjectAI';
import MockArray from './MockArrayAI';
import MockFunctionAI from './MockFunctionAI';
import MockDateAI from './MockDateAI';
import MockRegExpAI from './MockRegExpAI';
import MockPathAI from './MockPathAI';
import MockImageAI from './MockImageAI';
import MockColorAI from './MockColorAI';
import MockTextAI from './MockTextAI';
import MockNameAI from './MockNameAI';
import MockWebAI from './MockWebAI';

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
    } else if (mock[0] === 'Array') {
        content = <MockArray mock={mock[1]} name={name} onChange={onChange}></MockArray>;
    } else if (mock[0] === 'Function') {
        content = <MockFunctionAI mock={mock[1]} name={name} onChange={onChange}></MockFunctionAI>;
    } else if (mock[0] === 'Date') {
        content = <MockDateAI mock={mock[1]} name={name} onChange={onChange}></MockDateAI>;
    } else if (mock[0] === 'RegExp') {
        content = <MockRegExpAI name={name} onChange={onChange}></MockRegExpAI>;
    } else if (mock[0] === 'Path') {
        content = <MockPathAI mock={mock[1]} name={name} onChange={onChange}></MockPathAI>;
    } else if (mock[0] === 'Image') {
        content = <MockImageAI mock={mock[1]} name={name} onChange={onChange}></MockImageAI>;
    } else if (mock[0] === 'Color') {
        content = <MockColorAI mock={mock[1]} name={name} onChange={onChange}></MockColorAI>;
    } else if (mock[0] === 'Text') {
        content = <MockTextAI mock={mock[1]} name={name} onChange={onChange}></MockTextAI>;
    } else if (mock[0] === 'Name') {
        content = <MockNameAI mock={mock[1]} name={name} onChange={onChange}></MockNameAI>;
    } else if (mock[0] === 'Web') {
        content = <MockWebAI mock={mock[1]} name={name} onChange={onChange}></MockWebAI>;
    }

    return <>{content}</>;
};

export default MockDataGenerator;
