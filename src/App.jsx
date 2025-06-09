import { useEffect, useContext } from 'react'
import { Route, Routes, useNavigate } from 'react-router'
import Login from './pages/login/Login'
import Chat from './pages/chat/Chat'
import Profile from './pages/profile/Profile'
import { ToastContainer, toast } from 'react-toastify'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AppContext } from './context/AppContext';

function App() {

  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate('/chat');
        await loadUserData(user.uid);
      }
      else {
        navigate('/');
      }
    })
  }, [])

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
