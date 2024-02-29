import React, { useEffect, useState } from 'react'
import Header from '../components/common/Header'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import EpisodeDetails from '../components/Podcasts/EpisodeDetails';
import AudioPlayer from '../components/Podcasts/AudioPlayer';

// Functional component for the page to display details of a podcast
function PodcastDetailsPage() {
    // Retrieving parameters from the URL
    const { id } = useParams();
    // State variables for managing podcast data, episodes data, playing file, and creator of the podcast
    const [podcast, setPodcast] = useState({});
    const navigate = useNavigate();
    const [episodes, setEpisodes] = useState([]);
    const [playingFile, setPlayingFile] = useState("");
    const [createdByUser, setCreatedByUser] = useState(null);

    // Effect hook to fetch podcast and episodes data when the component mounts or ID changes
    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    // Function to fetch podcast and episodes data from Firestore
    const getData = async () => {
        try {
            // Retrieving podcast document from Firestore
            const docRef = doc(db, "podcasts", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Setting podcast data in state
                setPodcast({ id: id, ...docSnap.data() });
                // Retrieving creator's user document from Firestore
                const createdByUserId = docSnap.data().createdBy;
                const userDocRef = doc(db, "users", createdByUserId);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    // Setting creator's user data in state
                    setCreatedByUser(userDocSnap.data());
                }
            } else {
                // If podcast document doesn't exist, show error toast and navigate back to podcasts list
                toast.error("No such Podcast!");
                navigate("/podcasts")
            }
        } catch (e) {
            // Handling errors and showing error toast
            toast.error(e.message);
        }
    }

    // Effect hook to listen for changes in episodes collection in Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "podcasts", id, "episodes")),
            (querySnapshot) => {
                const episodesData = [];
                querySnapshot.forEach((doc) => {
                    episodesData.push({ id: doc.id, ...doc.data() });
                });
                // Setting episodes data in state
                setEpisodes(episodesData);
            },
            (error) => {
                // Handling errors and showing error toast
                toast.error(error.message);
            }
        );

        return () => {
            // Unsubscribing from snapshot listener when component unmounts
            unsubscribe();
        };
    }, [id])

    // Rendering the component
    return (
        <div>
            {/* Header component */}
            <Header />
            {/* Wrapper for podcast details */}
            <div className="input-wrapper space">
                {/* Conditional rendering of podcast details */}
                {podcast.id && (
                    <>
                        {/* Podcast title and create episode button */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <h1 className='podcast-title-heading'>{podcast.title}</h1>
                            {/* Render create episode button if current user is creator of the podcast */}
                            {podcast.createdBy == auth.currentUser.uid && (
                                <Button style={{ width: "200px", margin: "0px" }} text={"Create Episode"} onClick={() => { navigate(`/podcast/${id}/create-episode`) }} />
                            )}
                        </div>
                        {/* Banner image for the podcast */}
                        <div className='banner-wrapper'>
                            <img src={podcast.bannerImage} />
                        </div>
                        {/* Description of the podcast */}
                        <p className='podcast-description'>{podcast.description}</p>
                        {/* Title for the episodes section */}
                        <h1 className='podcast-title-heading'>Episodes</h1>
                        {/* Rendering episodes list or a message if no episodes available */}
                        {episodes.length > 0 ? (
                            <>{episodes.map((episode, index) => {
                                return <EpisodeDetails key={index} index={index + 1} title={episode.title} description={episode.description} audioFile={episode.audioFile} onClick={(file) => setPlayingFile(file)} />
                            })}</>) : (
                            <p>No Episodes Available</p>
                        )}
                        {/* Render creator's name if available */}
                        {createdByUser && (
                            <p className='createdby'>Created by: {createdByUser.name}</p>
                        )}
                    </>
                )}
            </div>
            {/* Render audio player if a file is playing */}
            {playingFile && (
                <AudioPlayer audioSrc={playingFile} image={podcast.displayImage} />
            )}
        </div>
    );
}

// Exporting the component
export default PodcastDetailsPage;
