import React, { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';

function Chatbox() {

    const { userData, messages, setMessages, messagesId, chatUser, chatVisible, setChatVisible } = useContext(AppContext);

    const [input, setInput] = useState("");

    const sendMessage = async () => {
        try {
            if (input && messagesId) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        text: input,
                        createAt: new Date(),
                    })
                })

                const userIDs = [chatUser.rId, userData.id];

                userIDs.forEach(async (id) => {
                    const userChatsRef = doc(db, 'chats', id);
                    const userChatsSnapshot = await getDoc(userChatsRef);
                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
                        userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
                        userChatData.chatsData[chatIndex].updatedAt = Date.now();
                        if (userChatData.chatsData[chatIndex].rId === userData.id) {
                            userChatData.chatsData[chatIndex].messageSeen = false;
                        }
                        await updateDoc(userChatsRef, {
                            chatsData: userChatData.chatsData
                        })
                    }
                })
            }
        } catch (error) {
            toast.error(error.message);
        }
        setInput("");
    }



    const sendImage = async (e) => {
        try {
            const fileUrl = await upload(e.target.file[0]);
            if (fileUrl && messagesId) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        image: fileUrl,
                        createAt: new Date(),
                    })
                })

                const userIDs = [chatUser.rId, userData.id];

                userIDs.forEach(async (id) => {
                    const userChatsRef = doc(db, 'chats', id);
                    const userChatsSnapshot = await getDoc(userChatsRef);
                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
                        userChatData.chatsData[chatIndex].lastMessage = "image";
                        userChatData.chatsData[chatIndex].updatedAt = Date.now();
                        if (userChatData.chatsData[chatIndex].rId === userData.id) {
                            userChatData.chatsData[chatIndex].messageSeen = false;
                        }
                        await updateDoc(userChatsRef, {
                            chatsData: userChatData.chatsData
                        })
                    }
                })
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    const convertTimestamp = (timestamp) => {
        let date = timestamp.toDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        if (hour > 12) {
            return hour - 12 + ":" + minute + " PM";
        }
        else {
            return hour + ":" + minute + " AM";
        }
    }


    useEffect(() => {
        if (messagesId) {
            const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
                setMessages(res.data().messages.reverse());
            })
            return () => {
                unSub();
            }
        }
    }, [messagesId])

    return chatUser ? (
        <div className={`h-[85vh] relative bg-gray-200 w-full ${chatVisible ? "" : "hidden lg:block"} `}>
            <div className='px-2.5 py-2.5 flex items-center gap-2.5 border-b border-b-gray-400'>
                <img
                    src={chatUser.userData.avatar || assets.avatar_icon}
                    alt="profile img"
                    className='w-9 rounded-full aspect-square'
                />
                <p
                    className='flex flex-1 items-center gap-1 font-medium text-xl'
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
                </p>
                <img
                    src={assets.help_icon}
                    alt="help"
                    className='w-6 rounded-full cursor-pointer hidden lg:block'
                />
                <img
                    onClick={() => setChatVisible(false)}
                    src={assets.arrow_icon}
                    alt="help"
                    className={`w-6 rounded-full cursor-pointer block lg:hidden`}
                />
            </div>


            {/* masseges section */}
            <div className='h-[calc(100%-70px)] pb-12 overflow-y-scroll flex flex-col-reverse'>
                {/* sender message */}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.sId === userData.id
                            ? `flex items-end justify-end gap-1.5 px-1 py-1`    //for sender
                            : `flex flex-row-reverse items-end justify-end px-1 py-1`   //for reciver
                        }
                    >
                        {
                            msg["image"]
                                ? <img
                                    src={msg.image}
                                    alt=""
                                    className='max-w-50 mb-7 rounded-lg'
                                />
                                : <p
                                    className={msg.sId === userData.id
                                        ? `text-white bg-blue-500 p-2 max-w-50 text-[13px] font-light rounded-[8px_8px_0px_8px] mb-7`   //for sender
                                        : `text-white bg-blue-500 p-2 max-w-50 text-[13px] font-light rounded-[8px_8px_8px_0px] mb-7`   //for reciver
                                    }

                                >
                                    {msg.text}

                                </p>
                        }

                        <div className='text-center text-[9px]'>
                            <img
                                // src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar}   //original logic
                                src={msg.sId === userData.id ? assets.avatar_icon : assets.avatar_icon} //temprory becose avatar is not store in storage
                                alt=""
                                className='w-7 aspect-square rounded-full'
                            />
                            <p>{convertTimestamp(msg.createAt)}</p>
                        </div>
                    </div>
                ))}

            </div>

            {/* bottom section  */}
            <div className='flex items-center gap-2 lg:gap-3 px-2.5 py-3 bg-white absolute bottom-2 left-0 right-0 rounded-full mx-4 shadow-md'>
                <input
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    type="text"
                    placeholder='Send a message'
                    className='flex-1 border-none outline-none px-2'
                />
                <input
                    onChange={sendImage}
                    type="file"
                    id='image'
                    accept='image/png, image/jpeg'
                    hidden
                />
                <label
                    htmlFor="image"
                    className='flex'
                >
                    <img
                        src={assets.gallery_icon}
                        alt="gallery"
                        className='w-4 lg:w-7 cursor-pointer'
                    />
                </label>
                <img
                    onClick={sendMessage}
                    src={assets.send_button}
                    alt='send'
                    className='w-5 lg:w-8 cursor-pointer'
                />
            </div>
        </div>
    )
        : <div className={`w-full flex flex-col justify-center items-center gap-2 ${chatVisible ? "" : "hidden lg:flex"}`}>
            <img
                src={assets.logo_icon}
                alt=""
                className='w-24 lg:w-32 opacity-60'
            />
            <p
                className='text-xl lg:text-3xl font-medium text-center opacity-60'
            >
                Chat anytime, anywhere
            </p>
        </div>
}

export default Chatbox

// 4:27min video complete 