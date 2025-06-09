import React, { useState } from 'react'
import assets from '../../assets/assets'
import { signup, login, resetPassword } from '../../config/firebase';

function Login() {

    const [currState, setCurrstate] = useState("Sign Up");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHamdler = (event) => {
        event.preventDefault();
        if (currState === "Sign Up") {
            signup(username, email, password)
        }
        else {
            login(email, password);
        }
    }

    return (
        <div className='min-h-screen bg-[url(/background.png)] bg-no-repeat bg-cover flex flex-col lg:flex-row justify-center lg:justify-evenly items-center gap-7 lg:gap-0'>
            <img
                src={assets.logo_big}
                alt="logo"
                className='max-w-80 w-60 lg:w-80'
            />

            <form
                onSubmit={onSubmitHamdler}
                className='bg-gray-200 flex flex-col gap-5 rounded-xl px-7 py-8'
            >
                <h2 className='text-2xl font-medium'>{currState}</h2>

                {
                    currState === "Sign Up"
                        ? <input
                            type='text'
                            placeholder='username'
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                            className='px-2 py-2.5 bg-gray-100 border border-gray-400 rounded-md outline-blue-300'
                        />
                        : null
                }

                <input
                    type='email'
                    placeholder='Email address'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    className='px-2 py-2.5 bg-gray-100 border border-gray-400 rounded-md outline-blue-300'
                />
                <input
                    type='password'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    autoComplete='off'
                    className='px-2 py-2.5 bg-gray-100 border border-gray-400 rounded-md outline-blue-300'
                />
                <button
                    type='submit'
                    className='p-2 bg-blue-500 text-white text-lg border-none rounded-md cursor-pointer hover:bg-blue-700'
                >
                    {currState === "Sign Up" ? "Create Account" : "Login Now"}
                </button>

                <div className='flex gap-2 text-sm text-gray-400'>
                    <input type="checkbox" />
                    <p>Agree to the terms of use & privacy policy.</p>
                </div>

                <div className='text-center'>
                    {
                        currState === "Sign Up"
                            ? <p
                                className='text-sm text-gray-600'
                            >Already have an account?
                                <span
                                    onClick={() => setCurrstate("Login")}
                                    className='font-medium text-blue-500 cursor-pointer'> Login here
                                </span>
                            </p>
                            : <p
                                className='text-sm text-gray-600'
                            >Create an Account
                                <span
                                    onClick={() => setCurrstate("Sign Up")}
                                    className='font-medium text-blue-500 cursor-pointer'> click here
                                </span>
                            </p>
                    }

                    {
                        currState === "Login"
                            ? <p
                                className='text-sm text-gray-600 mt-2'
                            >
                                Forgot Password
                                <span
                                    onClick={() => resetPassword(email)}
                                    className='font-medium text-blue-500 m-1 cursor-pointer'
                                >
                                    reset here
                                </span>
                            </p>
                            : null
                    }
                </div>
            </form>
        </div>
    )
}

export default Login
