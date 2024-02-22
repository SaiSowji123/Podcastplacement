import React, { useState } from 'react'
import Button from '../../common/Button';
import InputComponent from '../../common/Input';
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    console.log("Handling Signup...");
    setLoading(true);
    if (password == confirmPassword && password.length >= 8 && fullName && email) {
      try {
        //Creating User's Account.
        const userCrediential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCrediential.user;
        console.log("user", user);

        //Saving User's Details.
        await setDoc(doc(db, "users", user.uid), {
          name: fullName,
          email: user.email,
          uid: user.uid,
        });

        //Save data in the redux, call the redux action
        dispatch(
          setUser({
            name: fullName,
            email: user.email,
            uid: user.uid,
          })
        );
        toast.success("User has been created successfully!");
        setLoading(false);
        navigate("/profile");
      } catch (e) {
        console.log("error", e);
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      if (password != confirmPassword) {
        toast.error('Passwords do not match!');
      }
      else if (password.length < 8) {
        toast.error('Password should be at least 8 characters long!')
      }
      setLoading(false);
    }
  };

  return (
    <>
      <InputComponent state={fullName} setState={setFullName} placeholder="Full Name" type="text" required={true} />
      <InputComponent state={email} setState={setEmail} placeholder="Email" type="text" required={true} />
      <InputComponent state={password} setState={setPassword} placeholder="Password" type="password" required={true} />
      <InputComponent state={confirmPassword} setState={setConfirmPassword} placeholder="Confirm Password" type="password" required={true} />
      <Button text={loading ? "Loading..." : "Signup"} disabled={loading} onClick={handleSignup} />
    </>
  )
}

export default SignupForm;