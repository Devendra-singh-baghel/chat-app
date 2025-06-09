import React, { useContext, useEffect, useState } from 'react'
import LeftSidebar from '../../components/leftSidebar/LeftSidebar'
import Chatbox from '../../components/chatBox/Chatbox'
import RightSidebar from '../../components/rightSidebar/RightSidebar'
import { AppContext } from '../../context/AppContext'

function Chat() {

  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData])

  return (
    <div className='min-h-screen bg-linear-to-bl from-sky-700 to-indigo-700 grid place-items-center'>

      {
        loading
          ? <p className='text-3xl lg:text-5xl'>Loading....</p>
          : <div className='max-w-[1000px] w-[96%] h-[85vh] bg-blue-100 flex lg:grid grid-cols-[1fr_2fr_1fr]'>
            <LeftSidebar />
            <Chatbox />
            <RightSidebar />
          </div>
      }

    </div>
  )
}

export default Chat
