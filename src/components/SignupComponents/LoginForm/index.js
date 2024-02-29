import React, { useState } from 'react';
import Button from '../../common/Button';
import InputComponent from '../../common/Input';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { setUser } from '../../../slices/userSlice';
import { auth, db } from '../../../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Functional component for the login form
function LoginForm() {
  // State variables to manage form inputs and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle user login
  const handleLogin = async () => {
    setLoading(true);
    // Checking if email and password are provided
    if (email && password) {
      try {
        // Signing in the user with provided credentials
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Fetching user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        // Dispatching user data to Redux store
        dispatch(
          setUser({
            name: userData.name,
            email: user.email,
            uid: user.uid,
          })
        );
        
        // Displaying success message and navigating to profile page
        toast.success("Login Successful!");
        setLoading(false);
        navigate("/profile");
      } catch (error) {
        // Displaying error message if login fails
        console.error("Error signing in:", error);
        setLoading(false);
        toast.error(error.message);
      }
    } else {
      // Displaying error message if email or password is missing
      toast.error("Please enter all the fields.");
      setLoading(false);
    }
  }

  // Function to handle the password reset request
  const handleForgotPassword = async () => {
    // Checking if email is provided
    if (email) {
      try {
        // Sending password reset email
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent. Please check your inbox.");
      } catch (error) {
        // Displaying error message if sending email fails
        console.error("Error sending password reset email:", error);
        toast.error(error.message);
      }
    } else {
      // Displaying error message if email is missing
      toast.error("Please enter your email address to reset your password.");
    }
  };

  // Rendering the login form
  return (
    <>
      {/* Input fields for email and password */}
      <InputComponent state={email} setState={setEmail} placeholder="Email" type="text" required={true} />
      <InputComponent state={password} setState={setPassword} placeholder="Password" type="password" required={true} />
      
      {/* Button to submit the login form */}
      <Button text={loading ? "Loading..." : "Login"} onClick={handleLogin} disabled={loading} />
      
      {/* Link to handle password reset */}
      <p onClick={handleForgotPassword} className='forgot-password'>Forgot Password?</p>
    </>
  )
}

// Exporting the component
export default LoginForm;
