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

const MockDataGenerator: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [mockData, setMockData] = useState<MockData[]>([]);

  // 添加字段
  const addField = () => {
    setFields([...fields, { name: '', type: 'string' }]);
  };

  // 删除字段
  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  // 生成 Mock 数据
  const generateMockData = () => {
    const template: { [key: string]: any } = {};
    fields.forEach((field) => {
      switch (field.type) {
        case 'string':
          template[field.name] = Mock.Random.string(5, 10);
          break;
        case 'number':
          template[field.name] = Mock.Random.integer(1, 100);
          break;
        case 'boolean':
          template[field.name] = Mock.Random.boolean();
          break;
        case 'date':
          template[field.name] = Mock.Random.date('yyyy-MM-dd');
          break;
        default:
          template[field.name] = Mock.Random.string(5, 10);
      }
    });

    const data = Mock.mock({
      'list|10': [template], // 生成 10 条数据
    }).list;

    setMockData(data);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mock 数据生成器</h1>
      <Form layout="vertical">
        {fields.map((field, index) => (
          <Form.Item key={index} label={`字段 ${index + 1}`}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Input
                placeholder="字段名称"
                value={field.name}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index].name = e.target.value;
                  setFields(newFields);
                }}
              />
              <Select
                value={field.type}
                style={{ width: '120px' }}
                onChange={(value) => {
                  const newFields = [...fields];
                  newFields[index].type = value;
                  setFields(newFields);
                }}
              >
                <Option value="string">字符串</Option>
                <Option value="number">数字</Option>
                <Option value="boolean">布尔值</Option>
                <Option value="date">日期</Option>
              </Select>
              <Button danger onClick={() => removeField(index)}>
                删除
              </Button>
            </div>
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="dashed" onClick={addField}>
            添加字段
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={generateMockData}>
            生成 Mock 数据
          </Button>
        </Form.Item>
      </Form>

      {mockData.length > 0 && (
        <Table
          dataSource={mockData}
          columns={fields.map((field) => ({
            title: field.name,
            dataIndex: field.name,
            key: field.name,
          }))}
          rowKey={(record) => record[fields[0]?.name || 'id']}
          style={{ marginTop: '20px' }}
        />
      )}
    </div>
  );
};

export default MockDataGenerator;