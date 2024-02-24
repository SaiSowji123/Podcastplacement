import React, { useState } from 'react'
import Button from '../../common/Button';
import InputComponent from '../../common/Input';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { setUser } from '../../../slices/userSlice';
import { auth, db, storage } from '../../../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    if (email && password) {
      try {
        const userCrediential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCrediential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        dispatch(
          setUser({
            name: userData.name,
            email: user.email,
            uid: user.uid,
          })
        );
        toast.success("Login Successful!");
        setLoading(false);
        navigate("/profile");
      } catch (error) {
        console.error("Error signing in:", error);
        setLoading(false);
        toast.error(error.message);
      }
    } else {
      toast.error("Please enter all the fields.");
      setLoading(false);
    }
  }

  // Function to handle the password reset request
  const handleForgotPassword = async () => {
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent. Please check your inbox.");
      } catch (error) {
        console.error("Error sending password reset email:", error);
        toast.error(error.message);
      }
    } else {
      toast.error("Please enter your email address to reset your password.");
    }
  };

  return (
    <>
      <InputComponent state={email} setState={setEmail} placeholder="Email" type="text" required={true} />
      <InputComponent state={password} setState={setPassword} placeholder="Password" type="password" required={true} />
      <Button text={loading ? "Loading..." : "Login"} onClick={handleLogin} disabled={loading} />
      <p onClick={handleForgotPassword} className='forgot-password'>Forgot Password?</p>
    </>
  )
}

export default LoginForm