import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import Profile from './pages/Profile';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { setUser } from './slices/userSlice';
import { useDispatch } from 'react-redux';
import PrivateRoutes from './components/common/PrivateRoutes';
import CreateAPodcastPage from './pages/CreateAPodcast';
import PodcastsPage from './pages/Podcasts';
import PodcastDetailsPage from './pages/PodcastDetails';
import CreateAnEpisodePage from './pages/CreateAnEpisode';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Effect hook to manage user authentication and fetching user data
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is logged in, fetch user data from Firestore
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              // If user data exists, dispatch action to set user data in Redux store
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: user.uid,
                  profileImageUrl: userData.profileImageUrl,
                })
              );
            }
          },
          (error) => {
            // Handle error while fetching user data
            toast.error("Error fetching user data");
          }
        );
        return () => {
          // Unsubscribe from user data snapshot listener when component unmounts
          unsubscribeSnapshot();
        };
      }
    });

    return () => {
      // Unsubscribe from authentication listener when component unmounts
      unsubscribeAuth();
    };
  }, []);

  return (
    // Render main application component
    <div className="App">
      {/* Toast container for displaying notifications */}
      <ToastContainer />
      {/* Router component for managing navigation */}
      <Router>
        {/* Routes component for defining routes */}
        <Routes>
          {/* Route for sign-up page */}
          <Route path='/' element={<SignUpPage />}></Route>
          {/* Private routes accessible only when user is logged in */}
          <Route element={<PrivateRoutes />}>
            {/* Route for user profile */}
            <Route path='/profile' element={<Profile />}></Route>
            {/* Route for creating a podcast */}
            <Route path='/create-a-podcast' element={<CreateAPodcastPage />}></Route>
            {/* Route for listing podcasts */}
            <Route path='/podcasts' element={<PodcastsPage />}></Route>
            {/* Route for podcast details */}
            <Route path='/podcast/:id' element={<PodcastDetailsPage />}></Route>
            {/* Route for creating an episode for a podcast */}
            <Route path='/podcast/:id/create-episode' element={<CreateAnEpisodePage />}></Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
