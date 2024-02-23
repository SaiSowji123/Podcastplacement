import React, { useState } from 'react'
import Header from '../components/common/Header/index.js';
import SignupForm from '../components/SignupComponents/SignupForm/index.js';
import LoginForm from '../components/SignupComponents/LoginForm/index.js';

function SignUpPage() {

  const [flag, setFlag] = useState(false)

  return (
    <div><Header />
      <div className="input-wrapper space">
        {!flag ? <h1>Sign Up</h1> : <h1>Login</h1>}
        {!flag ? <SignupForm /> : <LoginForm />}
        {!flag ? <p onClick={() => setFlag(!flag)}>Already have an Account? Click here to <span className='login'>Login</span>.</p> : <p onClick={() => setFlag(!flag)}>Don't have an account? Click here to <span className='login'>Signup</span>.</p>}
      </div>
    </div>
  )
}

export default SignUpPage;