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

// Functional component for the signup form
function SignupForm() {
  // State variables to manage form inputs, loading status, and file error
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle user signup
  const handleSignup = async () => {
    // Displaying info message
    toast.info("Creating Profile");
    setLoading(true);

    // Regular expression to validate password pattern
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

    // Validating password pattern
    if (!passwordPattern.test(password)) {
      toast.error("Password must contain at least 8 characters, including uppercase, lowercase, numbers, and a special.");
      setLoading(false);
      return;
    }

    // Checking if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      setLoading(false);
      return;
    }

    // Checking if profile image is provided
    if (!profileImage) {
      setFileError("Profile image is required.");
      setLoading(false);
      return;
    }

    try {
      // Creating user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      let profileImageUrl = null;

      // Uploading profile image to storage if provided
      if (profileImage) {
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        await uploadBytes(storageRef, profileImage);
        profileImageUrl = await getDownloadURL(storageRef);
      }

      // Creating user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: fullName,
        email: user.email,
        uid: user.uid,
        profileImageUrl: profileImageUrl
      });

      // Dispatching user data to Redux store
      dispatch(
        setUser({
          name: fullName,
          email: user.email,
          uid: user.uid,
          profileImageUrl: profileImageUrl
        })
      );

      // Displaying success message and navigating to profile page
      toast.success("User created successfully!");
      setLoading(false);
      navigate("/profile");
    } catch (error) {
      // Displaying error message if signup fails
      console.error("Error signing up:", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  // Rendering the signup form
  return (
    <>
      {/* Input fields for full name, email, password, and confirm password */}
      <InputComponent state={fullName} setState={setFullName} placeholder="Full Name" type="text" required={true} />
      <InputComponent state={email} setState={setEmail} placeholder="Email" type="text" required={true} />
      <InputComponent state={password} setState={setPassword} placeholder="Password" type="password" required={true} />
      <InputComponent state={confirmPassword} setState={setConfirmPassword} placeholder="Confirm Password" type="password" required={true} />
      
      {/* File input for profile image */}
      <FileInput accept={'image/*'} id="profile-image-input" fileHandleFun={setProfileImage} text={"Upload Profile Image"} required={true} />
      
      {/* Error message for profile image */}
      {fileError && <p style={{ color: "red" }}>{fileError}</p>}
      
      {/* Button to submit the signup form */}
      <Button text={loading ? "Loading..." : "Signup"} disabled={loading} onClick={handleSignup} />
    </>
  );
}

// Exporting the component
export default SignupForm;
