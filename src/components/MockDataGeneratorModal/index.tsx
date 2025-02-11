import React from 'react';
import { Modal } from 'antd';
// import Mock from 'mockjs';

interface ModalProps {
    open: boolean;
    onCancel: () => void;
    onOk: () => void;
}

const MockDataGenerator: React.FC<ModalProps> = ({ open, onCancel, onOk }) => {
    return (
        <Modal title="Mock 数据生成器" open={open} onCancel={onCancel} cancelText="取消" okText="确认" footer={false}>
            123
        </Modal>
    );
};

export default MockDataGenerator;
