// pages/SetNewPasswordForm.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';

const SetNewPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get('token')) {
      message.error('Invalid password reset link');
      navigate('/login');
    }
  }, [location, navigate]);

  const handleSetNewPassword = async (values) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      const response = await axios.post(
        'http://localhost:5000/api/auth/set-first-password',
        {
          token,
          newPassword: values.newPassword,
        }
      );

      message.success('Password set successfully! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Failed to set password';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Set New Password</h1>
        <Form
          name="setNewPassword"
          layout="vertical"
          onFinish={handleSetNewPassword}
          autoComplete="off"
        >
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
              {loading ? 'Setting Password...' : 'Set Password'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SetNewPasswordForm;
