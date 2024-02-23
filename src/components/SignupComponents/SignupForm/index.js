import React, { useState } from 'react';
import Button from '../../common/Button';
import InputComponent from '../../common/Input';
import { auth, db, storage } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FileInput from '../../common/Input/FileInput';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      let profileImageUrl = null;

      if (profileImage) {
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        await uploadBytes(storageRef, profileImage);
        profileImageUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        name: fullName,
        email: user.email,
        uid: user.uid,
        profileImageUrl: profileImageUrl
      });

      dispatch(
        setUser({
          name: fullName,
          email: user.email,
          uid: user.uid,
          profileImageUrl: profileImageUrl
        })
      );

      toast.success("User created successfully!");
      setLoading(false);
      navigate("/profile");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <InputComponent state={fullName} setState={setFullName} placeholder="Full Name" type="text" required={true} />
      <InputComponent state={email} setState={setEmail} placeholder="Email" type="text" required={true} />
      <InputComponent state={password} setState={setPassword} placeholder="Password" type="password" required={true} />
      <InputComponent state={confirmPassword} setState={setConfirmPassword} placeholder="Confirm Password" type="password" required={true} />
      <FileInput accept={'image/*'} id="profile-image-input" fileHandleFun={setProfileImage} text={"Upload Profile Image"} />
      <Button text={loading ? "Loading..." : "Signup"} disabled={loading} onClick={handleSignup} />
    </>
  );
}

export default SignupForm;
