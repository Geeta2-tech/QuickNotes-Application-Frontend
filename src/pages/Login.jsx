import React from 'react'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie';
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleShowPass = () => {
        if (!showPassword) {
            setShowPassword(true);
        } else {
            setShowPassword(false);
        }

    };

    const userLogin = async () => {
        await axios.post('http://localhost:3000/api/users/login', {
            email,
            password
        }).then((res) => {
            console.log(res);
            if (res.status === 200) {
                Cookies.set('token', res.data.token, { expires: 7 }); // 
                toast.success(
                    <strong>WELCOME {res.data.user.name.toUpperCase()}!</strong>
                );
                navigate('/dashboard'); 

            } else {
                toast.error(res.data.message || 'Login failed');
            }
        }).catch((err) => {
            console.error(err);
            toast.error(err.response?.data?.message || 'An error occurred during Login');
        });
    }
    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden">

            <div
                className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
                style={{
                    backgroundImage: `url('https://images.pexels.com/photos/1629212/pexels-photo-1629212.jpeg?cs=srgb&dl=pexels-minan1398-1629212.jpg&fm=jpg')`,
                }}
            ></div>


            <div className="relative z-10 w-[600px]  p-8 border-4 border-black-500 rounded-lg text-white shadow-lg bg-pink-50 backdrop-blur-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>
                <div className="flex flex-col gap-4 items-center justify-center ">
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="p-3 w-70 rounded  text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="relative w-70">
                        <button
                            type="button"
                            onClick={handleShowPass}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                        >
                            {showPassword ? '🙈' : '👁'}
                        </button>

                        <input
                            type={showPassword ? "text" : "password"}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="p-3 pl-10 w-full rounded text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <button onClick={userLogin} className="bg-yellow-300 w-50 hover:bg-blue-300 text-black font-bold py-2 rounded">
                            Login
                        </button>
                    </motion.div>
                    <p className='text-black'>Don't have an account
                        <a href="/signup" className="text-blue-400 hover:underline"> Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
