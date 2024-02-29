import React, { useState } from 'react';
import Header from '../components/common/Header/index.js';
import SignupForm from '../components/SignupComponents/SignupForm/index.js';
import LoginForm from '../components/SignupComponents/LoginForm/index.js';

// Functional component for the Sign Up page
function SignUpPage() {
  // State variable to toggle between Sign Up and Login forms
  const [flag, setFlag] = useState(false);

  // Rendering the component
  return (
    <div>
      {/* Header component */}
      <Header />
      <div className="input-wrapper space">
        {/* Conditional rendering based on flag state */}
        {!flag ? <h1>Sign Up</h1> : <h1>Login</h1>}
        {!flag ? <SignupForm /> : <LoginForm />}
        {/* Link to toggle between Sign Up and Login */}
        {!flag ? 
          <p onClick={() => setFlag(!flag)}>
            Already have an Account? Click here to <span className='login'>Login</span>.
          </p> 
          : 
          <p onClick={() => setFlag(!flag)}>
            Don't have an account? Click here to <span className='login'>Signup</span>.
          </p>
        }
      </div>
    </div>
  );
}

// Exporting the component
export default SignUpPage;
