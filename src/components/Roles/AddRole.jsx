import React, { useState } from 'react';
import { Modal, Button, Form, Input, Checkbox, message } from 'antd';
import axios from 'axios';
import { pageActions } from './rolePermissions';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AddRole = ({ onRoleAdded, addedBy }) => {
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ form ] = Form.useForm();
  const [ selectedPermissions, setSelectedPermissions ] = useState(
    pageActions.reduce((acc, page) => ({ ...acc, [ page.value ]: [] }), {})
  );

  const showModal = () => setIsModalVisible(true);

  const handlePermissionChange = (pageValue, list) => {
    setSelectedPermissions((prev) => ({ ...prev, [ pageValue ]: list }));
  };

  const handleCheckAllChange = (pageValue, actions, checked) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [ pageValue ]: checked ? actions.map((action) => action.value) : [],
    }));
  };

  const handleOk = async (values) => {
    const { role_name } = values;

    const permissions = Object.entries(selectedPermissions).flatMap(([ resource, actions ]) =>
      actions.map((action) => `${action}:${resource}`)
    ).filter(Boolean);

    if (permissions.length === 0) {
      message.warning('Please select at least one permission');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:5000/api/roles`, {
        name: role_name,
        permissions,
        added_by: addedBy
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data) {
        message.success('Role added successfully!');
        form.resetFields();
        setSelectedPermissions(
          pageActions.reduce((acc, page) => ({ ...acc, [ page.value ]: [] }), {})
        );
        setIsModalVisible(false);
        if (onRoleAdded) {
          onRoleAdded(response.data);
        }
      }
    } catch (error) {
      console.error('Error adding role:', error);
      let errorMessage = 'Failed to add role.';

      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        console.error('Server error details:', error.response.data);
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your connection';
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedPermissions(
      pageActions.reduce((acc, page) => ({ ...acc, [ page.value ]: [] }), {})
    );
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button color="default" variant="solid" onClick={showModal}>
        Add Role
      </Button>

      <Modal title="Create New Role" open={isModalVisible} onCancel={handleCancel} footer={null} maskClosable={false} style={{ top: 20 }} >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleOk}
          initialValues={{ added_by: addedBy }}
        >
          <Form.Item
            label="Role Name"
            name="role_name"
            rules={[
              { required: true, message: 'Please input the role name!' },
              { min: 3, message: 'Role name must be at least 3 characters!' },
              { max: 50, message: 'Role name cannot exceed 50 characters!' }
            ]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>

          <div className="permissions-section">
            {pageActions.map((page) => {
              const allChecked = selectedPermissions[ page.value ].length === page.actions.length;
              const indeterminate =
                selectedPermissions[ page.value ].length > 0 &&
                selectedPermissions[ page.value ].length < page.actions.length;

              return (
                <div key={page.value}>
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={(e) => handleCheckAllChange(page.value, page.actions, e.target.checked)}
                    checked={allChecked}
                    className="mt-3"
                  >
                    {page.label} - Check all
                  </Checkbox>
                  <Checkbox.Group
                    options={page.actions.map(action => ({
                      label: action.label,
                      value: action.value
                    }))}
                    value={selectedPermissions[ page.value ]}
                    onChange={(list) => handlePermissionChange(page.value, list)}
                  />
                </div>
              );
            })}
          </div>

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