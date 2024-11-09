import { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';
import Logo from '../assets/icons/logo-biru.svg';
import backgroundImage from '../assets/icons/login.svg';

const AuthForm = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    console.log('=== LOGIN REQUEST START ===');

    try {
      const loginData = {
        username: values.username.trim(),
        password: values.password.trim(),
        remember: values.remember
      };

      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000
        }
      );      

      console.log('Login response:', response.data);

      if (response.data && response.data.token) {
        // Simpan token tanpa prefix 'Bearer '
        localStorage.setItem('token', response.data.token);
        
        if (response.data.user) {
          localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        }
      
        if (response.data.user && response.data.user.permissions) {
          localStorage.setItem('permissions', JSON.stringify(response.data.user.permissions));
        }      

        message.success('Login berhasil!');

        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      let errorMessage = 'Login gagal. Silakan coba lagi.';

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = error.response.data.msg || 'Username atau password salah';
            break;
          case 400:
            errorMessage = error.response.data.msg || 'Data login tidak valid';
            break;
          case 500:
            errorMessage = 'Server error. Silakan coba lagi nanti.';
            break;
          default:
            errorMessage = error.response.data.msg || errorMessage;
        }
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
      console.log('=== LOGIN REQUEST END ===');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:w-1/2 p-8 flex flex-col justify-between h-auto">
          <div className="mb-3 text-center">
            <img src={Logo} alt="Logo" className="mx-auto" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Welcome back!
          </h1>
          <p className="text-gray-600 mb-3 text-center text-sm md:text-base">
            Enter to get unlimited access to data & information.
          </p>

          <Form
            name="basic"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
                { whitespace: true, message: 'Username cannot be empty!' },
                { min: 3, message: 'Username must be at least 3 characters!' }
              ]}
              className="mb-2"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { whitespace: true, message: 'Password cannot be empty!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
              className="mb-2"
            >
              <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" className="mb-3">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div
          className="md:w-1/2 bg-cover bg-center h-64 md:h-auto"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      </div>
    </div>
  );
};

export default AuthForm;