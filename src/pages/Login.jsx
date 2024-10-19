import { useState } from 'react';
import Logo from '../assets/icons/logo-biru.svg'
import backgroundImage from '../assets/icons/login.svg'

const AuthForm = () => {
  const [ isSignUp, setIsSignUp ] = useState(false);

  const toggleAuthMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:w-1/2 p-8 flex flex-col justify-between h-auto">
          <div className="mb-3 text-center">
            <img src={Logo} alt="Logo" className="mx-auto" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">Welcome back!</h1>
          <p className="text-gray-600 mb-6 text-center text-sm md:text-base">Enter to get unlimited access to data & information.</p>
          <form>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email <span className='text-red-600'>*</span>
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Enter your mail address" />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password <span className='text-red-600'>*</span>
              </label>
              <div className="relative">
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Enter password" />
                <i className="fas fa-eye absolute right-3 top-3 text-gray-500"></i>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-blue-600" />
                <span className="ml-2 text-gray-700 text-xs md:text-sm">Remember me</span>
              </label>
              <a className="inline-block align-baseline font-bold text-xs md:text-sm text-blue-600 hover:text-blue-800" href="#">
                Forgot password?
              </a>
            </div>
            <div className="mb-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
                Log In
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-gray-600 text-xs md:text-sm">Don't have an account? <a className="text-blue-600 hover:text-blue-800" href="#">Register here</a></p>
          </div>
        </div>
        <div className="md:w-1/2 bg-cover bg-center h-64 md:h-auto" style={{ backgroundImage: `url(${backgroundImage})` }}>
          {/* Placeholder for the left side image */}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;