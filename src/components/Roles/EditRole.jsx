import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Checkbox, message } from 'antd';
import axios from 'axios';
import { pageActions } from './rolePermissions';

const EditRole = ({ visible, role, onClose, updated_at }) => {
    const [ form ] = Form.useForm();
    const [ selectedPermissions, setSelectedPermissions ] = useState({});

    useEffect(() => {
        if (role) {
            form.setFieldsValue({ role_name: role.name });

            // Ambil role_permissions dari backend jika belum ada di localStorage
            const fetchPermissions = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/roles/${role.id}/permissions`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });

                    // Check if response is an array (permissions)
                    if (Array.isArray(response.data)) {
                        const permissions = {};
                        response.data.forEach((perm) => {
                            const [ action, page ] = perm.split(':');
                            if (!permissions[ page ]) permissions[ page ] = [];
                            permissions[ page ].push(action);
                        });

                        setSelectedPermissions(permissions);
                    } else {
                        console.error("Unexpected response format:", response.data);
                        message.error('Unexpected response format for permissions.');
                    }
                } catch (error) {
                    console.error("Failed to fetch permissions:", error);
                    message.error('Failed to fetch permissions.');
                }
            };

            // Cek apakah role.permissions sudah ada
            if (role.permissions && role.permissions.length > 0) {
                const permissions = {};
                role.permissions.forEach((perm) => {
                    const [ action, page ] = perm.split(':');
                    if (!permissions[ page ]) permissions[ page ] = [];
                    permissions[ page ].push(action);
                });
                setSelectedPermissions(permissions);
            } else {
                fetchPermissions();
            }
        } else {
            form.resetFields();
            setSelectedPermissions({});
        }
    }, [ role, form ]);

    const handlePermissionChange = (page, list) => {
        setSelectedPermissions((prev) => ({ ...prev, [ page ]: list }));
    };

    const handleCheckAllChange = (page, actions, checked) => {
        setSelectedPermissions((prev) => ({
            ...prev,
            [ page ]: checked ? actions.map((action) => action.value) : [],
        }));
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const permissions = Object.entries(selectedPermissions).flatMap(([page, actions]) =>
                actions.map((action) => `${action}:${page}`)
            );
    
            // Debugging: Log the permissions array
            console.log("Permissions being sent:", permissions);
    
            await axios.put(`http://localhost:5000/api/roles/${role.id}`, {
                name: values.role_name,
                permissions,
                updated_by: updated_at,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
    
            message.success('Role updated successfully');
            onClose();
        } catch (error) {
            console.error('Error updating role:', error);
            message.error('Failed to update role');
        }
    };

    return (
        <Modal
            title="Edit Role"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleOk}>
                <Form.Item label="Role Name" name="role_name" rules={[ { required: true } ]}>
                    <Input placeholder="Enter role name" />
                </Form.Item>
                <div className="permissions-section">
                    {pageActions.map((page) => (
                        <div key={page.value}>
                            <Checkbox
                                indeterminate={selectedPermissions[ page.value ]?.length > 0 && selectedPermissions[ page.value ].length < page.actions.length}
                                onChange={(e) => handleCheckAllChange(page.value, page.actions, e.target.checked)}
                                checked={selectedPermissions[ page.value ]?.length === page.actions.length}
                                className="mt-3"
                            >
                                {page.label} - Check all
                            </Checkbox>
                            <div>
                                <Checkbox.Group
                                    options={page.actions.map(action => ({ label: action.label, value: action.value }))}
                                    value={selectedPermissions[ page.value ]}
                                    onChange={(list) => handlePermissionChange(page.value, list)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full mt-4">
                        Update Role
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditRole;
