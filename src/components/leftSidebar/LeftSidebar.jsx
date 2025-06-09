import React, { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router';
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

function LeftSidebar() {

    const navigate = useNavigate();
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const { userData, chatData, chatUser, setChatUser, messagesId, setMessagesId, chatVisible, setChatVisible } = useContext(AppContext);

    const inputHandler = async (e) => {
        try {
            const input = e.target.value;
            if (input) {
                setShowSearch(true);
                const userRef = collection(db, 'users');
                const q = query(userRef, where("username", "==", input.toLowerCase()));
                const querySnap = await getDocs(q);
                // console.log(querySnap)
                if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {

                    const userId = querySnap.docs[0].id;
                    const userData = querySnap.docs[0].data();

                    let userExist = chatData.some((user) => user.rId === userId);

                    if (!userExist) {
                        setUser({ id: userId, ...userData });
                    } else {
                        setUser(null);
                    }
                }

            }
            else {
                setShowSearch(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    const addChat = async () => {
        const messagesRef = collection(db, "messages");
        const chatsRef = collection(db, "chats");
        try {
            const newMessageRef = doc(messagesRef);
            await setDoc(newMessageRef, {
                createAt: serverTimestamp(),
                messages: []
            })
            await updateDoc(doc(chatsRef, user.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: '',
                    rId: userData.id,
                    updateAt: Date.now(),
                    messageSeen: true,
                })
            })

            await updateDoc(doc(chatsRef, userData.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: '',
                    rId: user.id,
                    updateAt: Date.now(),
                    messageSeen: true,
                })
            })

            const uSnap = await getDoc(doc(db, 'users', user.id));
            const uData = uSnap.data();
            setChat({
                messagesId: newMessageRef.id,
                lastMessage: "",
                rId: user.id,
                updatedAt: Date.now(),
                messageSeen: true,
                userData: uData,
            })
            setShowSearch(false);
            setChatVisible(true);
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    const setChat = async (item) => {
        try {
            // console.log(item);
            setMessagesId(item.messageId);
            setChatUser(item);
            const userChatsRef = doc(db, 'chats', userData.id);
            const userChatsSnapshot = await getDoc(userChatsRef);
            const userChatsData = userChatsSnapshot.data();
            const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId);
            userChatsData.chatsData[chatIndex].messageSeen = true;
            await updateDoc(userChatsRef, {
                chatsData: userChatsData.chatsData,
            })
            setChatVisible(true);
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        const updateChatUserData = async () => {
            if (chatUser) {
                const userRef = doc(db, 'users', chatUser.userData.id);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.data();
                setChatUser(prev => ({ ...prev, userData: userData }))
            }
        }
        updateChatUserData();
    }, [chatData])

    return (
        <div className={`bg-gray-800 text-white h-[85vh] w-full ${chatVisible ? "hidden lg:block" : ""}`}>
            <div className='p-5'>

                <div className='flex justify-between items-center'>
                    <img
                        src={assets.logo}
                        alt="logo"
                        className='max-w-35'
                    />

                    {/* menu  */}
                    <div
                        className='relative px-2.5 py-2'
                        onMouseEnter={() => setSubMenuOpen(true)}
                        onMouseLeave={() => setSubMenuOpen(false)}
                    >
                        <img
                            src={assets.menu_icon}
                            alt="menu"
                            className='max-h-5 cursor-pointer opacity-65'
                        />

                        {/* sub menu */}
                        {
                            subMenuOpen && (
                                <div className={`absolute top-full right-0 text-center w-33 p-5 rounded-sm bg-white text-gray-900`}>
                                    <p
                                        onClick={() => navigate('/profile')}
                                        className='cursor-pointer text-sm'
                                    >
                                        Edit Profile
                                    </p>

                                    <hr className='border-none h-0.5 bg-gray-400 mx-0 my-2' />

                                    <p
                                        className='cursor-pointer text-sm'
                                    >
                                        Logout
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </div>


                <div className='bg-blue-900 flex items-center gap-2.5 px-2.5 py-3 mt-5'>
                    <img
                        src={assets.search_icon}
                        alt="search"
                        className='w-4'
                    />
                    <input
                        type="text"
                        placeholder='Search here...'
                        onChange={inputHandler}
                        className='bg-transparent border-none outline-none text-white text-sm'
                    />
                </div>
            </div>
            <div className='flex flex-col h-[70%] overflow-y-scroll'>
                {
                    showSearch && user
                        ? <div
                            onClick={addChat}
                            className='flex items-center gap-2.5 px-2.5 py-2 hover:bg-blue-500 cursor-pointer'
                        >
                            <img src={user.avatar || assets.avatar_icon} alt="img" />
                            {/* now avatar in not avilable so it is desable now. */}
                            <p>{user.name}</p>
                        </div>
                        : chatData.map((item, index) => (
                            <div
                                onClick={() => setChat(item)}
                                key={index}
                                className={`flex items-center gap-2.5 px-2.5 py-2 hover:bg-blue-500 cursor-pointer`}
                            >
                                <img
                                    src={item.userData.avatar || assets.avatar_icon}
                                    alt="profile img"
                                    className={`w-8 aspect-square rounded-full ${item.messageSeen || item.messageId === messagesId ? "" : "border-2 border-green-400"}`}
                                />
                                <div className={`flex flex-col`}>
                                    <p>{item.userData.name}</p>
                                    <span
                                        className={`text-gray-500 text-sm hover:text-white ${item.messageSeen || item.messageId === messagesId ? "" : "text-green-400"}`}>
                                        {item.lastMessage}
                                    </span>
                                </div>
                            </div>
                        ))
                }
            </div>
        </div>
    )
}

export default LeftSidebar

