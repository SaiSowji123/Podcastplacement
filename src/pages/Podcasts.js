import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { setPodcasts } from '../slices/podcastSlice';
import { useDispatch, useSelector } from 'react-redux';
import PodcastCard from '../components/Podcasts/PodcastCard';
import InputComponent from '../components/common/Input';

function PodcastsPage() {
    const dispatch = useDispatch();
    const podcasts = useSelector((state) => state.podcasts.podcasts);
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");
    const [otherSpecify, setOtherSpecify] = useState("");

    const allGenres = ["Alternative", "Blues", "Classical", "Country", "Electronic", "Hip Hop", "Jazz", "Pop", "R&B", "Rock", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Science Fiction", "Thriller"];

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "podcasts")),
            (querySnapshot) => {
                const podcastsData = [];
                querySnapshot.forEach((doc) => {
                    podcastsData.push({ id: doc.id, ...doc.data() });
                });
                dispatch(setPodcasts(podcastsData));
            },
            (error) => {
                console.error("Error fetching podcasts:", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    const filteredPodcasts = podcasts.filter((item) => {
        const matchesSearch = item.title.trim().toLowerCase().includes(search.trim().toLowerCase());
        let matchesGenre = !genre || genre === "All Genres" || item.genre === genre;
        if (genre === "Others") {
            matchesGenre = !allGenres.includes(item.genre);
        }
        return matchesSearch && matchesGenre;
    });

    const handleRandomGenre = () => {
        let availableGenres = allGenres;
        if (genre === "Others") {
            // Exclude genres already listed in the dropdown
            availableGenres = allGenres.filter(option => !document.querySelector(`option[value="${option}"]`));
        }
        const randomGenre = availableGenres[Math.floor(Math.random() * availableGenres.length)];
        setGenre(randomGenre);
    };

    return (
        <div>
            <Header />
            <div className='input-wrapper space' >
                <h1>Discover Podcasts</h1>
                <InputComponent state={search} setState={setSearch} placeholder="Search By Title" type="text" />
                <p className='or'>Or</p>
                <span className='dropdown'><span className='name'>Search by Genre</span>
                    <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} required>
                        <option value="">Select Genre</option>
                        <optgroup label="All">
                        <option value="All Genres">All Genres</option>
                        </optgroup>
                        <optgroup label="Music">
                            <option value="Alternative">Alternative</option>
                            <option value="Blues">Blues</option>
                            <option value="Classical">Classical</option>
                            <option value="Country">Country</option>
                            <option value="Electronic">Electronic</option>
                            <option value="Hip Hop">Hip Hop</option>
                            <option value="Jazz">Jazz</option>
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
                    <button className='random-button' onClick={handleRandomGenre}>Random Genre</button>
                </span>
                {filteredPodcasts.length > 0 ? (
                    <div className='podcasts-flex' style={{ marginTop: "1.5rem" }}>
                        {filteredPodcasts.map((item) => {
                            return (
                                <PodcastCard key={item.id} id={item.id} title={item.title} displayImage={item.displayImage} />
                            );
                        })}
                    </div>
                ) : (
                    <p>{search ? "Podcast Not Found" : "No Podcast on the Platform"}</p>
                )}
            </div>
        </div >
    )
}

export default PodcastsPage