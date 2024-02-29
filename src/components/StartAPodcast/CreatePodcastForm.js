import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputComponent from '../common/Input';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import FileInput from '../common/Input/FileInput';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';

// Functional component for the Create Podcast form
function CreatePodcastForm() {
    // State variables to manage form inputs and loading status
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [displayImage, setDisplayImage] = useState();
    const [bannerImage, setBannerImage] = useState();
    const [genre, setGenre] = useState("");
    const [loading, setLoading] = useState(false);
    const [otherSpecify, setOtherSpecify] = useState("");
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = async () => {
        // Displaying information message
        toast.info("Creating Podcast");
        // Validating form fields
        if (title && desc && displayImage && bannerImage && genre) {
            setLoading(true)
            try {
                // Uploading display image
                const bannerImageRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );
                await uploadBytes(bannerImageRef, bannerImage);
                const bannerImageUrl = await getDownloadURL(bannerImageRef);

                // Uploading banner image
                const displayImageRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );
                await uploadBytes(displayImageRef, displayImage);
                const displayImageUrl = await getDownloadURL(displayImageRef);

                // Creating podcast data
                const podcastData = {
                    title: title,
                    description: desc,
                    bannerImage: bannerImageUrl,
                    displayImage: displayImageUrl,
                    createdBy: auth.currentUser.uid,
                    genre: genre === "Others" ? otherSpecify : genre,
                };

                // Adding podcast data to Firestore
                const docRef = await addDoc(collection(db, "podcasts"), podcastData);

                // Resetting form fields and displaying success message
                setTitle("");
                setDesc("");
                setBannerImage(null);
                setDisplayImage(null);
                setGenre("");
                setOtherSpecify("");
                toast.success("Podcast Created!");
                setLoading(false);

                // Navigating to the created podcast's page
                navigate(`/podcast/${docRef.id}`);
            } catch (e) {
                // Displaying error message if an error occurs during submission
                toast.error(e.message);
                setLoading(false);
            }
        } else {
            // Displaying error message if any required field is missing
            toast.error("Please enter all the fields");
            setLoading(true);
        }
    }

    // Function to handle display image selection
    const displayImageHandle = (file) => {
        setDisplayImage(file);
    }

    // Function to handle banner image selection
    const bannerImageHandle = (file) => {
        setBannerImage(file);
    }

    // Rendering the form
    return (
        <>
            {/* Input fields for podcast title and description */}
            <InputComponent state={title} setState={setTitle} placeholder="Title" type="text" required={true} />
            <InputComponent state={desc} setState={setDesc} placeholder="Description" type="text" required={true} />

            {/* File input fields for display image and banner image */}
            <FileInput accept={'image/*'} id="display-image-input" fileHandleFun={displayImageHandle} text={"Display Image Upload"} />
            <FileInput accept={'image/*'} id="banner-image-input" fileHandleFun={bannerImageHandle} text={"Banner Image Upload"} />

            {/* Dropdown menu for selecting podcast genre */}
            <div style={{ display: "flex", marginBottom: "2rem" }}>
                <span className="genre-label">
                    <label htmlFor="genre-w">Genre</label>
                    <select id="genre-w" value={genre} onChange={(e) => setGenre(e.target.value)} required>
                        <option value="">Select Genre</option>
                        <optgroup label="Music">
                            <option value="Blues">Blues</option>
                            <option value="Classical">Classical</option>
                            <option value="Country">Country</option>
                            <option value="Electronic">Electronic</option>
                            <option value="Hip Hop">Hip Hop</option>
                            <option value="Jazz">Jazz</option>
                            <option value="Mashup">Mashup</option>
                            <option value="Pop">Pop</option>
                            <option value="R&B">R&B</option>
                            <option value="Rock">Rock</option>
                        </optgroup>
                        <optgroup label="Stories">
                            <option value="Action">Action</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Drama">Drama</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Horror">Horror</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Romance">Romance</option>
                            <option value="Science Fiction">Science Fiction</option>
                            <option value="Thriller">Thriller</option>
                        </optgroup>
                        <optgroup label="Other">
                            <option value="Others">Others</option>
                        </optgroup>
                    </select>
                </span>
            </div>

            {/* Button to submit the form */}
            <Button text={loading ? "Loading..." : "Create Podcast"} disabled={loading} onClick={handleSubmit} />
        </>
    );
}

// Exporting the component
export default CreatePodcastForm;
