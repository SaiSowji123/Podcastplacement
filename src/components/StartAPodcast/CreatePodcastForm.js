import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import InputComponent from '../common/Input';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import FileInput from '../common/Input/FileInput';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';

function CreatePodcastForm() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [displayImage, setDisplayImage] = useState();
    const [bannerImage, setBannerImage] = useState();
    const [genre, setGenre] = useState("");
    const [loading, setLoading] = useState(false);
    const [otherSpecify, setOtherSpecify] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        toast.info("Creating Podcast");
        if (title && desc && displayImage && bannerImage && genre) {
            setLoading(true)
            // 1. Upload files -> get downloadable links
            try {
                const bannerImageRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );
                await uploadBytes(bannerImageRef, bannerImage);

                const bannerImageUrl = await getDownloadURL(bannerImageRef);

                const displayImageRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );
                await uploadBytes(displayImageRef, displayImage);

                const displayImageUrl = await getDownloadURL(displayImageRef);

                const podcastData = {
                    title: title,
                    description: desc,
                    bannerImage: bannerImageUrl,
                    displayImage: displayImageUrl,
                    createdBy: auth.currentUser.uid,
                    genre: genre === "Others" ? otherSpecify : genre,
                };
                const docRef = await addDoc(collection(db, "podcasts"), podcastData);
                setTitle("");
                setDesc("");
                setBannerImage(null);
                setDisplayImage(null);
                setGenre("");
                setOtherSpecify("");
                toast.success("Podcast Created!");
                setLoading(false);
                navigate(`/podcast/${docRef.id}`);
            } catch (e) {
                toast.error(e.message);
                setLoading(false)
            }

            // 2. create a new doc in  a new collection called podcasts
            // 3. save the new podcast episodes states in our podcasts
        } else {
            toast.error("Please enter all the fileds");
            setLoading(true)
        }
    }

    const displayImageHandle = (file) => {
        setDisplayImage(file)
    }

    const bannerImageHandle = (file) => {
        setBannerImage(file)
    }
    return (
        <>
            <InputComponent state={title} setState={setTitle} placeholder="Title" type="text" required={true} />
            <InputComponent state={desc} setState={setDesc} placeholder="Description" type="text" required={true} />
            <FileInput accept={'image/*'} id="display-image-input" fileHandleFun={displayImageHandle} text={"Dispaly Image Upload"} />
            <FileInput accept={'image/*'} id="banner-image-input" fileHandleFun={bannerImageHandle} text={"Banner Image Upload"} />
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
            <Button text={loading ? "Loading..." : "Create Podcast"} disabled={loading} onClick={handleSubmit} />
        </>
    )
}

export default CreatePodcastForm