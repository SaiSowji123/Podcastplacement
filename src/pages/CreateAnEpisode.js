import React, { useState } from 'react'
import Header from '../components/common/Header'
import { useNavigate, useParams } from 'react-router-dom';
import InputComponent from '../components/common/Input';
import Button from '../components/common/Button';
import FileInput from '../components/common/Input/FileInput';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

function CreateAnEpisodePage() {
    // Retrieving parameters from the URL
    const { id } = useParams();
    // State variables for managing form inputs and loading state
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [audioFile, setAudioFile] = useState();
    const [loading, setLoading] = useState(false);
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Function to handle audio file selection
    const audioFileHandle = (file) => {
        setAudioFile(file);
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        // Displaying info toast indicating episode creation process
        toast.info("Creating an Episode!");
        // Setting loading state to true to indicate loading process
        setLoading(true);
        // Checking if all required fields are filled and podcast ID is available
        if ((title && desc && audioFile && id)) {
            try {
                // Reference for storing audio file in Firebase Storage
                const audioRef = ref(
                    storage,
                    `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
                );
                // Uploading audio file to Firebase Storage
                await uploadBytes(audioRef, audioFile);

                // Getting download URL of the uploaded audio file
                const audioURL = await getDownloadURL(audioRef);

                // Data object for the episode
                const episodesData = {
                    title: title,
                    description: desc,
                    audioFile: audioURL,
                };

                // Adding episode data to Firestore
                await addDoc(
                    collection(db, "podcasts", id, "episodes"),
                    episodesData
                )
                // Displaying success toast
                toast.success('Episode Created Successfully!');
                // Resetting loading state
                setLoading(false)
                // Navigating back to podcast details page
                navigate(`/podcast/${id}`);
                // Resetting form fields
                setTitle("");
                setDesc("");
                setAudioFile("");
            } catch (e) {
                // Handling error and displaying error toast
                toast.error(e.message);
                // Resetting loading state
                setLoading(false);
            }
        }
        else {
            // Displaying error toast if any required field is missing
            toast.error("Please fill out all fields");
            // Resetting loading state
            setLoading(false);
        }
    };
    
    // Rendering the component
    return (
        <div>
            {/* Header component */}
            <Header />
            {/* Form for creating an episode */}
            <div className='input-wrapper space'>
                <h1 style={{color: "white"}}>Create an Episode</h1>
                {/* Input field for episode title */}
                <InputComponent state={title} setState={setTitle} placeholder="Title" type="text" required={true} />
                {/* Input field for episode description */}
                <InputComponent state={desc} setState={setDesc} placeholder="Description" type="text" required={true} />
                {/* File input component for uploading audio file */}
                <FileInput accept={'audio/*'} id="audio-file-input" fileHandleFun={audioFileHandle} text={"Upload Audio File"} />
                {/* Button for submitting the form */}
                <Button text={loading ? "Loading..." : "Create Episode"} disabled={loading} onClick={handleSubmit} />
            </div>
        </div>
    )
}

// Exporting the component
export default CreateAnEpisodePage
