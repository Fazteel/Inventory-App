import { useState } from 'react';

const AuthForm = () => {
  const [ isSignUp, setIsSignUp ] = useState(false);

  const toggleAuthMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
        <div className="mb-8">
          <img src="https://placehold.co/50x50" alt="Logo" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back !</h1>
        <p className="text-gray-600 mb-6">Enter to get unlimited access to data & information.</p>
        <form className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email *
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Enter your mail address" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password *
            </label>
            <div className="relative">
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Enter password" />
              <i className="fas fa-eye absolute right-3 top-3 text-gray-500"></i>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-indigo-600" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <a className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800" href="#">
              Forgot your password ?
            </a>
          </div>
          <div className="mb-6">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
              Log In
            </button>
          </div>
          <div className="flex items-center justify-center mb-6">
            <hr className="w-full border-gray-300" />
            <span className="absolute bg-white px-4 text-gray-600">Or, Login with</span>
          </div>
          <div className="mb-6">
            <button className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center">
              <img src="https://placehold.co/20x20" alt="Google Logo" className="mr-2" />
              Sign up with google
            </button>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Don't have an account ? <a className="text-indigo-600 hover:text-indigo-800" href="#">Register here</a></p>
          </div>
        </form>
      </div>
      <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/600x800')" }}>
        {/* Placeholder for the right side image */}
      </div>
    </div>
  );
};

export default AuthForm;
