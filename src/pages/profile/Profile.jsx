import React, { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

function Profile() {

  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      // if (!prevImage && image) {
      //   toast.error("Upload profile picture.")
      // }
      const docRef = doc(db, 'users', uid);

      await updateDoc(docRef, {
        bio: bio,
        name: name,
      })


      // if (image) {
      //   const imgUrl = await upload(image);
      //   setPrevImage(imgUrl);
      //   await updateDoc(docRef, {
      //     avatar: imgUrl,
      //     bio: bio,
      //     name: name,
      //   })
      // }
      // else {
      //   await updateDoc(docRef, {
      //     bio: bio,
      //     name: name,
      //   })
      // }

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat');
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid)
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }
      }

      // if user login nahi hai to home page me navigate karo
      else {
        navigate('/')
      }
    })
  }, [])

  return (
    <div className='min-h-screen bg-[url(/background.png)] bg-no-repeat bg-cover flex items-center justify-center'>
      <div className='bg-white flex items-center justify-between min-w-1/3'>
        <form
          onSubmit={profileUpdate}
          className='flex flex-col gap-5 p-10'>
          <h3 className='font-medium'>Profile Details</h3>

          <label
            htmlFor="avatar"
            className='flex items-center gap-3 text-gray-400 cursor-pointer'>
            <input
              type="file"
              id='avatar'
              accept='.jpg, .jpg, jpeg'
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt="avatar"
              className='w-12 aspect-square rounded-full'
            />
            upload profile image
          </label>

          <input
            type="text"
            placeholder='Your name'
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
            className='p-3 min-w-80 border border-gray-400 rounded-md outline-blue-400'
          />

          <textarea
            name="bio"
            id="bio"
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder='Write profile bio' required
            className='p-3 min-w-80 border border-gray-400 rounded-md outline-blue-400'
          />

          <button
            type='submit'
            className='border-none text-white bg-blue-500 hover:bg-blue-700 p-2 cursor-pointer duration-300 rounded-md'
          >
            Save
          </button>

        </form>

        <img
          // here i use nested ternuary operator 
          src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon}
          alt="logo"
          className='max-w-40 aspect-square mx-5 my-5 rounded-full'
        />

      </div>
    </div>
  )
}

export default Profile;

// 3:05min video complete 
