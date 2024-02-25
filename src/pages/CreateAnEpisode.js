import React, { useState } from 'react'
import Header from '../components/common/Header'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InputComponent from '../components/common/Input';
import Button from '../components/common/Button';
import FileInput from '../components/common/Input/FileInput';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

function CreateAnEpisodePage() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [audioFile, setAudioFile] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const audioFileHandle = (file) => {
        setAudioFile(file);
    };
    const handleSubmit = async () => {
        toast.info("Creating an Episode!");
        setLoading(true);
        if ((title && desc && audioFile && id)) {
            try {
                const audioRef = ref(
                    storage,
                    `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
                );
                await uploadBytes(audioRef, audioFile);

                const audioURL = await getDownloadURL(audioRef);
                const episodesData = {
                    title: title,
                    description: desc,
                    audioFile: audioURL,
                };

                await addDoc(
                    collection(db, "podcasts", id, "episodes"),
                    episodesData
                )
                toast.success('Episode Created Successfully!');
                setLoading(false)
                navigate(`/podcast/${id}`);
                setTitle("");
                setDesc("");
                setAudioFile("");
            } catch (e) {
                toast.error(e.message);
                setLoading(false);
            }
        }
        else {
            toast.error("Please fill out all fields");
            setLoading(false);
        }
    };
    return (
        <div>
            <Header />
            <div className='input-wrapper space'>
                <h1 style={{color: "white"}}>Create an Episode</h1>
                <InputComponent state={title} setState={setTitle} placeholder="Title" type="text" required={true} />
                <InputComponent state={desc} setState={setDesc} placeholder="Description" type="text" required={true} />
                <FileInput accept={'audio/*'} id="audio-file-input" fileHandleFun={audioFileHandle} text={"Upload Audio File"} />
                <Button text={loading ? "Loading..." : "Create Episode"} disabled={loading} onClick={handleSubmit} />
            </div>
        </div>
    )
}

export default CreateAnEpisodePage