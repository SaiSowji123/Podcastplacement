import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUpPage from './pages/SignUpPage';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
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
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: user.uid,
                })
              );
            }
          },
          (error) => {
            console.log("Error fetching user data:", error);
          }
        );
        return () => {
          unsubscribeSnapshot();
        };
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path='/' element={<SignUpPage />}></Route>
          <Route element={<PrivateRoutes />}>
            <Route path='/profile' element={<Profile />}></Route>
            <Route path='/create-a-podcast' element={<CreateAPodcastPage />}></Route>
            <Route path='/podcasts' element={<PodcastsPage />}></Route>
            <Route path='/podcast/:id' element={<PodcastDetailsPage />}></Route>
            <Route path='/podcast/:id/create-episode' element={<CreateAnEpisodePage />}></Route>
            {/* 
            <Route path='/podcasts' element={<Podcasts />}></Route>
            <Route path='/podcast/:podcastId' element={<PodcastDetails />}></Route>
             */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
