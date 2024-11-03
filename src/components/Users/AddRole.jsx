import React, { useState } from 'react';
import { Modal, Button, Form, Input, Checkbox, Divider, message } from 'antd';
import axios from 'axios';

const pageActions = [
  {
    label: 'User Management',
    value: 'user',
    actions: [
      { label: 'CRUD - Create', value: 'create' },
      { label: 'CRUD - Read', value: 'view' },
      { label: 'CRUD - Update', value: 'edit' },
      { label: 'CRUD - Delete', value: 'delete' },
    ],
  },
  {
    label: 'Product Management',
    value: 'product',
    actions: [
      { label: 'CRUD - Create', value: 'create' },
      { label: 'CRUD - Read', value: 'view' },
      { label: 'CRUD - Update', value: 'edit' },
      { label: 'CRUD - Delete', value: 'delete' },
    ],
  },
  {
    label: 'Transaction Management',
    value: 'transaction',
    actions: [
      { label: 'CRUD - Create', value: 'create' },
      { label: 'CRUD - Read', value: 'view' },
      { label: 'CRUD - Update', value: 'edit' },
      { label: 'CRUD - Delete', value: 'delete' },
      { label: 'Transaction Cancel', value: 'cancel' },
    ],
  },
  {
    label: 'Inventory Management',
    value: 'inventory',
    actions: [
      { label: 'CRUD - Create', value: 'create' },
      { label: 'CRUD - Read', value: 'view' },
      { label: 'CRUD - Update', value: 'edit' },
      { label: 'CRUD - Delete', value: 'delete' },
      { label: 'Inventory Adjust', value: 'adjust' },
    ],
  },
  {
    label: 'Reports',
    value: 'report',
    actions: [
      { label: 'Sales Report', value: 'sales' },
      { label: 'Financial Report', value: 'financial' },
    ],
  },
];

const AddRole = ({ onRoleAdded }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState(
    pageActions.reduce((acc, page) => ({ ...acc, [page.value]: [] }), {})
  );

  const showModal = () => setIsModalVisible(true);

  const handlePermissionChange = (pageValue, list) => {
    setSelectedPermissions((prev) => ({ ...prev, [pageValue]: list }));
  };

  const handleCheckAllChange = (pageValue, actions, checked) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [pageValue]: checked ? actions.map((action) => action.value) : [],
    }));
  };

  const handleOk = async (values) => {
    const { role_name } = values;
    const permissions = Object.entries(selectedPermissions).flatMap(([page, actions]) =>
      actions.map((action) => `${page}.${action}`)
    );

    try {
      await axios.post('http://localhost:5000/api/roles/add', {
        role_name,
        permissions,
      });
      message.success('Role added successfully!');
      form.resetFields();
      setIsModalVisible(false);
      onRoleAdded();
    } catch (error) {
      message.error('Failed to add role.');
      console.error('Error adding role:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Button color="default" variant="solid" onClick={showModal}>
        Add Role
      </Button>
      <Modal title="Create New Role" open={isModalVisible} onCancel={handleCancel} footer={null} style={{top: 20}}>
        <Form layout="vertical" form={form} onFinish={handleOk}>
          <Form.Item
            label="Role Name"
            name="role_name"
            rules={[{ required: true, message: 'Please input the role name!' }]}
          >
            <Input placeholder="Role Name" />
          </Form.Item>

          {pageActions.map((page) => {
            const allChecked = selectedPermissions[page.value].length === page.actions.length;
            const indeterminate =
              selectedPermissions[page.value].length > 0 &&
              selectedPermissions[page.value].length < page.actions.length;

            return (
              <div key={page.value} style={{ marginBottom: '1rem' }}>
                <Checkbox indeterminate={indeterminate} onChange={(e) =>
                    handleCheckAllChange(page.value, page.actions, e.target.checked)
                  } checked={allChecked} className='mb-2'>
                  {page.label} - Check all
                </Checkbox>
                <Checkbox.Group
                  options={page.actions}
                  value={selectedPermissions[page.value]}
                  onChange={(list) => handlePermissionChange(page.value, list)}
                />
              </div>
            );
          })}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full mt-4">
              Add Role
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddRole;
