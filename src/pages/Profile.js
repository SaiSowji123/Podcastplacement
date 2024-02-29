import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import { useSelector } from 'react-redux';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import PodcastCard from '../components/Podcasts/PodcastCard';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import './styles.css';

// Functional component for the profile page
function Profile() {
    // Redux hook to access user state
    const user = useSelector((state) => state.user.user);
    // State variables for user's podcasts and loading status
    const [userPodcasts, setUserPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Effect hook to fetch user's podcasts when user state changes
    useEffect(() => {
        const fetchUserPodcasts = async () => {
            if (user) {
                try {
                    // Querying user's podcasts from Firestore
                    const q = query(collection(db, 'podcasts'), where('createdBy', '==', user.uid));
                    const querySnapshot = await getDocs(q);
                    const userPodcastsData = [];
                    querySnapshot.forEach((doc) => {
                        userPodcastsData.push({ id: doc.id, ...doc.data() });
                    });
                    // Updating user's podcasts in state and setting loading status
                    setUserPodcasts(userPodcastsData);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching user podcasts:', error);
                    // Setting loading status in case of error
                    setLoading(false);
                }
            }
        };
        // Calling fetchUserPodcasts function when user state changes
        fetchUserPodcasts();
    }, [user]);

    // Function to handle user logout
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Showing success toast on successful logout
                toast.success("Sign-out successful.");
            })
            .catch((error) => {
                // Showing error toast if logout fails
                toast.error(error.message);
            });
    };

    // Rendering the component
    return (
        <div>
            {/* Header component */}
            <Header />
            {/* Conditional rendering based on user state */}
            {user ? (
                <div className="input-wrapper space">
                    <h1>Profile</h1>
                    {/* Profile information */}
                    <div className="profile-container">
                        <img src={user.profileImageUrl} alt="Profile" className='profile-card' />
                        <div className="profile-left">
                            <h1>{user.name}</h1>
                            <p>{user.email}</p>
                            <p>{user.uid}</p>
                            {/* Button for logout */}
                            <Button text="Logout" onClick={handleLogout} style={{ width: "200px", marginLeft: 0, fontSize: "20px" }} />
                        </div>
                    </div>
                    {/* User's podcasts section */}
                    <div className="your-podcasts">
                        <h2>Your Podcasts</h2>
                        {/* Conditional rendering based on loading status */}
                        {loading ? (
                            <Loader />
                        ) : userPodcasts.length > 0 ? (
                            <div className='podcasts-flex'>
                                {/* Rendering user's podcasts */}
                                {userPodcasts.map((podcast) => (
                                    <PodcastCard key={podcast.id} id={podcast.id} title={podcast.title} displayImage={podcast.displayImage} />
                                ))}
                            </div>
                        ) : (
                            <p>No podcasts found.</p>
                        )}
                    </div>
                </div>
            ) : (
                // Show loader if user is not available
                <Loader />
            )}
        </div>
    );
}

// Exporting the component
export default Profile;
