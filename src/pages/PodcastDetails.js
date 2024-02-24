import React, { useEffect, useState } from 'react'
import Header from '../components/common/Header'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import EpisodeDetails from '../components/Podcasts/EpisodeDetails';
import AudioPlayer from '../components/Podcasts/AudioPlayer';

function PodcastDetailsPage() {
    const { id } = useParams();
    const [podcast, setPodcast] = useState({});
    const navigate = useNavigate();
    const [episodes, setEpisodes] = useState([]);
    const [playingFile, setPlayingFile] = useState("");
    const [createdByUser, setCreatedByUser] = useState(null);

    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    const getData = async () => {
        try {
            const docRef = doc(db, "podcasts", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPodcast({ id: id, ...docSnap.data() });
                const createdByUserId = docSnap.data().createdBy;
                const userDocRef = doc(db, "users", createdByUserId);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setCreatedByUser(userDocSnap.data());
                }
            } else {
                // docSnap.data() will be undefined in this case
                toast.error("No such Podcast!");
                navigate("/podcasts")
            }
        } catch (e) {
            toast.error(e.message);
        }
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "podcasts", id, "episodes")),
            (querySnapshot) => {
                const episodesData = [];
                querySnapshot.forEach((doc) => {
                    episodesData.push({ id: doc.id, ...doc.data() });
                });
                setEpisodes(episodesData);
            },
            (error) => {
                toast.error(error.message);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [id])

    return (
        <div>
            <Header />
            <div className="input-wrapper space">
                {podcast.id && (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <h1 className='podcast-title-heading'>{podcast.title}</h1>
                            {podcast.createdBy == auth.currentUser.uid && (
                                <Button style={{ width: "200px", margin: "0px" }} text={"Create Episode"} onClick={() => { navigate(`/podcast/${id}/create-episode`) }} />
                            )}
                        </div>
                        <div className='banner-wrapper'>
                            <img src={podcast.bannerImage} />
                        </div>
                        <p className='podcast-description'>{podcast.description}</p>
                        <h1 className='podcast-title-heading'>Episodes</h1>
                        {episodes.length > 0 ? (
                            <>{episodes.map((episode, index) => {
                                return <EpisodeDetails key={index} index={index + 1} title={episode.title} description={episode.description} audioFile={episode.audioFile} onClick={(file) => setPlayingFile(file)} />
                            })}</>) : (
                            <p>No Episodes Available</p>
                        )}
                        {createdByUser && (
                            <p className='createdby'>Created by: {createdByUser.name}</p>
                        )}
                        {/* <a href={`https://open.spotify.com/show/${podcast.spotifyId}`} target="_blank">Listen on Spotify</a> */}
                    </>
                )}
            </div>
            {playingFile && (
                <AudioPlayer audioSrc={playingFile} image={podcast.displayImage} />
            )}
        </div>
    );
}

export default PodcastDetailsPage;