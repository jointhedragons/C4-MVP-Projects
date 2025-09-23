import React, { useState } from 'react';

const Login = () => {
  const [state, setState] = useState('Sign up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // Add your login/signup logic here
  };

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center'>
      <div className='flex flex-col gap-4 m-auto items-start p-6 sm:p-8 min-w-[340px] sm:min-w-96 border border-gray-300 rounded-xl text-gray-700 text-sm bg-white shadow-lg'>
        <p className='text-2xl font-semibold'>
          {state === 'Sign up' ? 'Create Account' : 'Login'}
        </p>
        <p className='text-gray-500'>
          Please {state === 'Sign up' ? 'Sign Up' : 'log in'} to create a trip
        </p>
        {state === 'Sign up' && (
          <div className='w-full pt-2'>
            <p className='font-medium'>Full Name</p>
            <input
              className='border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500'
              type='text'
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder='Enter your full name'
            />
          </div>
        )}
        <div className='w-full'>
          <p className='font-medium'>Email</p>
          <input
            className='border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500'
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder='Enter your email'
          />
        </div>
        <div className='w-full'>
          <p className='font-medium'>Password</p>
          <input
            className='border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder='Enter your password'
          />
        </div>
        <button
          type='submit'
          className='bg-amber-500 text-white w-full h-10 rounded-md text-base font-medium hover:bg-amber-600 transition-colors shadow-md'
        >
          {state === 'Sign up' ? 'Create Account' : 'Login'}
        </button>
        <p
          className='text-gray-500 hover:text-amber-500 cursor-pointer transition-colors'
          onClick={() => setState(state === 'Sign up' ? 'Login' : 'Sign up')}
        >
          {state === 'Sign up'
            ? 'Already have an account? Login here'
            : 'Create a new account? Click here'}
        </p>
      </div>
    </form>
  );
};

export default Login;