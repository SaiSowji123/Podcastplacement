import React, { useState } from 'react'
import Button from '../../common/Button';
import InputComponent from '../../common/Input';
import { signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
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
    console.log("Handling Login");
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
  return (
    <>
      <InputComponent state={email} setState={setEmail} placeholder="Email" type="text" required={true} />
      <InputComponent state={password} setState={setPassword} placeholder="Password" type="password" required={true} />
      <Button text={loading ? "Loading..." : "Login"} onClick={handleLogin} disabled={loading} />
    </>
  )
}

export default LoginForm