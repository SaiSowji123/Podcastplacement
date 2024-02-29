import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header'
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import { setPodcasts } from '../slices/podcastSlice';
import { useDispatch, useSelector } from 'react-redux';
import PodcastCard from '../components/Podcasts/PodcastCard';
import InputComponent from '../components/common/Input';

// Functional component for the page to display podcasts
function PodcastsPage() {
    // Redux hooks for dispatching actions and selecting state
    const dispatch = useDispatch();
    const podcasts = useSelector((state) => state.podcasts.podcasts);
    // State variables for search and genre filtering
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");

    // Array containing all available genres
    const allGenres = ["Blues", "Classical", "Country", "Electronic", "Hip Hop", "Jazz", "Mashup", "Pop", "R&B", "Rock", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Science Fiction", "Thriller"];

    // Effect hook to fetch podcasts data from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "podcasts")),
            (querySnapshot) => {
                const podcastsData = [];
                querySnapshot.forEach((doc) => {
                    podcastsData.push({ id: doc.id, ...doc.data() });
                });
                // Dispatching action to update podcasts state in Redux store
                dispatch(setPodcasts(podcastsData));
            },
            (error) => {
                console.error("Error fetching podcasts:", error);
            }
        );
        return () => {
            // Unsubscribing from snapshot listener when component unmounts
            unsubscribe();
        };
    }, [dispatch]);

    // Function to filter podcasts based on search and genre
    const filteredPodcasts = podcasts.filter((item) => {
        // Filter based on title search
        const matchesSearch = item.title.trim().toLowerCase().includes(search.trim().toLowerCase());
        // Filter based on selected genre
        let matchesGenre = !genre || genre === "All Genres" || item.genre === genre;
        // Handle "Others" genre selection
        if (genre === "Others") {
            matchesGenre = !allGenres.includes(item.genre);
        }
        return matchesSearch && matchesGenre;
    });

    // Function to handle selecting a random genre
    const handleRandomGenre = () => {
        // Get available genres based on current selection
        let availableGenres = allGenres;
        if (genre === "Others") {
            // Exclude genres already listed in the dropdown
            availableGenres = allGenres.filter(option => !document.querySelector(`option[value="${option}"]`));
        }
        // Select a random genre from available genres
        const randomGenre = availableGenres[Math.floor(Math.random() * availableGenres.length)];
        // Set the selected random genre
        setGenre(randomGenre);
    };

    // Rendering the component
    return (
        <div>
            {/* Header component */}
            <Header />
            <div className='input-wrapper space' >
                <h1>Discover Podcasts</h1>
                {/* Input field for searching by title */}
                <InputComponent state={search} setState={setSearch} placeholder="Search By Title" type="text" />
                <p className='or'>Or</p>
                {/* Dropdown for selecting genre */}
                <span className='dropdown'><span className='name'>Search by Genre</span>
                    <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} required>
                        <option value="">Select Genre</option>
                        {/* Optgroup for all genres */}
                        <optgroup label="All">
                            <option value="All Genres">All Genres</option>
                        </optgroup>
                        {/* Optgroup for music genres */}
                        <optgroup label="Music">
                            {allGenres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </optgroup>
                        {/* Optgroup for story genres */}
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
                        {/* Optgroup for other genres */}
                        <optgroup label="Other">
                            <option value="Others">Others</option>
                        </optgroup>
                    </select>
                    {/* Button to select random genre */}
                    <button className='random-button' onClick={handleRandomGenre}>Random Genre</button>
                </span>
                {/* Render filtered podcasts */}
                {filteredPodcasts.length > 0 ? (
                    <div className='podcasts-flex' style={{ marginTop: "1.5rem" }}>
                        {filteredPodcasts.map((item) => {
                            return (
                                <PodcastCard key={item.id} id={item.id} title={item.title} displayImage={item.displayImage} />
                            );
                        })}
                    </div>
                ) : (
                    // Render message if no podcasts found
                    <p>{search ? "Podcast Not Found" : "No Podcast on the Platform"}</p>
                )}
            </div>
        </div >
    )
}

// Exporting the component
export default PodcastsPage;
