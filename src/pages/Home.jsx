import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white px-4">
            {/* Motion wrapper for the main content */}
            <motion.div
                className="text-center max-w-xl"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                {/* Animated heading with scaling effect */}
                <motion.h1
                    className="text-4xl md:text-5xl font-extrabold mb-6"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    Welcome to <span className="text-yellow-300">QuickNotes</span>
                </motion.h1>

                {/* Animated description */}
                <motion.p
                    className="text-lg md:text-xl mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    Your personal space to capture thoughts, organize ideas, and stay productive — beautifully and securely.
                </motion.p>

                {/* Animated buttons */}
                <motion.div
                    className="flex justify-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    {/* Login Button */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/login"
                            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-yellow-100 transition"
                        >
                            Login
                        </Link>
                    </motion.div>

                    {/* Register Button */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/signup"
                            className="bg-yellow-300 text-black font-semibold px-6 py-3 rounded shadow hover:bg-yellow-400 transition"
                        >
                            Register
                        </Link>
                    </motion.div>

                    {/* Dashboard button */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/dashboard"
                            className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded shadow hover:bg-yellow-400 transition"
                        >
                            Start creating notes ➡️
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;
