import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // Toggle password visibility
    const handleShowPass = () => {
        setShowPassword(prevState => !prevState);
    };

    // Handle user registration
    const userRegister = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/users/register', {
                name,
                email,
                password,
            });

            if (res.status === 201) {
                toast.success(
                    'You are registered successfully, please login to continue.'
                );
                navigate('/login'); // Redirect to login page after successful registration
            } else {
                toast.error(res.data.message || 'Registration failed');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred during registration');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
                style={{
                    backgroundImage: `url('https://images.pexels.com/photos/1629212/pexels-photo-1629212.jpeg?cs=srgb&dl=pexels-minan1398-1629212.jpg&fm=jpg')`,
                }}
            ></div>

            {/* Signup Form */}
            <div className="relative z-10 w-[600px] p-8 border-4 border-black-500 rounded-lg text-white shadow-lg bg-pink-50 backdrop-blur-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-black">Create an Account</h2>
                <div className="flex flex-col gap-4 items-center justify-center">
                    {/* Name Input */}
                    <input
                        type="text"
                        name="name"
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="p-3 w-70 rounded text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Email Input */}
                    <input
                        type="email"
                        name="email"
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="p-3 w-70 rounded text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Password Input with Toggle */}
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
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="p-3 pl-10 w-full rounded text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Register Button */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <button
                            type="button"
                            onClick={userRegister}
                            className="bg-yellow-300 w-50 hover:bg-blue-300 text-black font-bold py-2 rounded"
                        >
                            Register
                        </button>
                    </motion.div>

                    {/* Login Link */}
                    <p className="text-black">
                        Already have an account?
                        <a href="/login" className="text-blue-400 hover:underline"> Log-in</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
