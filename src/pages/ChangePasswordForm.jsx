// src/pages/ChangePasswordForm.jsx
import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';

const ChangePasswordForm = () => {
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/change-password',
        {
          currentPassword: values.currentPassword.trim(),
          newPassword: values.newPassword.trim(),
          confirmNewPassword: values.confirmNewPassword.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      message.success('Password berhasil diubah!');
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Gagal mengubah password. Silakan coba lagi.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Change Password</h1>
        <Form
          name="changePassword"
          layout="vertical"
          onFinish={handleChangePassword}
          autoComplete="off"
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: 'Please enter your current password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please enter a new password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmNewPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
