import { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';
import Logo from '../assets/icons/logo-biru.svg';
import backgroundImage from '../assets/icons/login.svg';

const AuthForm = () => {
  const [ loading, setLoading ] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', values); // Debug log

      const response = await axios.post('http://localhost:5000/api/login', {
        username: values.username,
        password: values.password,
      });

      console.log('Login response:', response.data); // Debug log

      // Simpan token dan data user ke localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify({
        id: response.data.user.id,
        username: response.data.user.username,
        // tambahkan data pengguna lainnya sesuai kebutuhan
      }));

      // Umpan balik sukses dan navigasi
      message.success('Login berhasil!');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error.response?.data || error); // Debug log

      const errorMessage = error.response?.data?.msg || 'Login gagal. Silakan coba lagi.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
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
              rules={[ { required: true, message: 'Please input your username!' } ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[ { required: true, message: 'Please input your password!' } ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <a className="text-blue-600 hover:text-blue-800" href="#">
                Register here
              </a>
            </p>
          </div>
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