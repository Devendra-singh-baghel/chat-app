import React, { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import { login, logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'

function RightSidebar() {

    const { chatUser, messages } = useContext(AppContext);
    const [msgImages, setMsgImages] = useState([]);

    useEffect(() => {
        let tempVar = [];
        messages.map((msg) => {
            if (msg.image) {
                tempVar.push(msg.image);
            }
        })

        // console.log(tempVar);
        // abhi images nahi h isliye empty array show ho raha 

        setMsgImages(tempVar);

    }, [messages])

    return chatUser ? (
        <div className='text-white bg-slate-900 relative h-[85vh] overflow-y-scroll hidden lg:block'>
            <div className='pt-10 flex flex-col justify-center items-center text-center gap-2 max-w-[70%] m-auto'>
                <img
                    src={chatUser.userData.avatar || assets.avatar_icon}
                    alt="profile img"
                    className='w-30 aspect-square rounded-full'
                />

                <h3
                    className='text-sm lg:text-md font-medium flex items-center justify-center gap-0 lg:gap-1 mx-0 lg:mx-1 my-0'
                >
                    {chatUser.userData.name}

                    {
                        Date.now() - chatUser.userData.lastSeen <= 70000
                            ? <img
                                src={assets.green_dot}
                                className='dot'
                            />
                            : null
                    }
                </h3>

                <p
                    className='text-[10px] opacity-65 font-light'
                >
                    {chatUser.userData.bio}
                </p>

            </div>

            <hr className='border-gray-500 mx-0 my-4' />

            <div className='px-3 py-2 text-sm'>
                <p>Media</p>
                <div className='max-h-45 overflow-y-scroll grid grid-cols-[1fr_1fr_1fr] gap-1 mt-2'>

                    {
                        msgImages.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt=""
                                onClick={() => window.open(url)}
                                className='w-15 rounded-sm cursor-pointer'
                            />
                        ))
                    }

                    {/* <img src={assets.pic1} alt="" className='w-15 rounded-sm cursor-pointer' />
                    <img src={assets.pic2} alt="" className='w-15 rounded-sm cursor-pointer' />
                    <img src={assets.pic3} alt="" className='w-15 rounded-sm cursor-pointer' />
                    <img src={assets.pic4} alt="" className='w-15 rounded-sm cursor-pointer' />
                    <img src={assets.pic2} alt="" className='w-15 rounded-sm cursor-pointer' />
                    <img src={assets.pic1} alt="" className='w-15 rounded-sm cursor-pointer' /> */}
                </div>
            </div>
            <button
                onClick={() => logout()}
                className='absolute bottom-5 left-[50%] transform translate-x-[-50%] bg-blue-600 hover:bg-blue-800 duration-300 text-white border-none text-sm font-light px-10 py-3 rounded-4xl cursor-pointer'
            >
                Logout
            </button>
        </div>
    )
        : (
            <div className='text-white bg-slate-900 relative h-[85vh] overflow-y-scroll'>
                <button
                    onClick={() => logout()}
                    className='absolute bottom-5 left-[50%] transform translate-x-[-50%] bg-blue-600 hover:bg-blue-800 duration-300 text-white border-none text-sm font-light px-10 py-3 rounded-4xl cursor-pointer'
                >
                    Logout
                </button>
            </div>
        )
}

export default RightSidebar
