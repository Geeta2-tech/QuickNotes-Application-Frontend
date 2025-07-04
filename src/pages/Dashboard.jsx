import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState('#ffffff');
    const token = Cookies.get('token');

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            toast.error('Please login to access the dashboard');
            navigate('/login');
        }
    }, []);

    const handleAddCard = () => {
        if (!title || !content) {
            toast.error('Please fill in both title and content');
            return;
        }
        const newCard = { title, content, color };
        setCards([...cards, newCard]);
        setTitle('');
        setContent('');
        setColor('#ffffff');
        setShowForm(false);

    };


    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;

        try {
            const res = await axios.post('http://localhost:3000/api/users/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                } //  this includes cookies
            });

            if (res.status === 200) {
                Cookies.remove('token'); // remove manually stored token (if any)
                toast.success('Logged out successfully');
                navigate('/login');
            } else {
                toast.error('Logout failed');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };


    return (
        <div className="min-h-screen p-6 bg-blue-100 relative">
            <div className="absolute top-6 right-6 group flex flex-col items-end">
                {/* User Icon */}
                <FaUserCircle className="text-4xl text-gray-800 cursor-pointer" />

                {/* Logout Button on Hover */}
                <button
                    onClick={handleLogout}
                    className="mt-2 bg-red-400 text-white text-sm px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    Logout
                </button>
            </div>


            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Let's create <span className="text-yellow-500">Quick</span> Notes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {cards.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center min-h-[200px]">
                        <span className="text-xl text-gray-500 font-semibold">No notes created yet...</span>
                    </div>
                ) : (
                    cards.map((card, index) => (
                        <div
                            key={index}
                            className="p-4 rounded shadow-md text-black"
                            style={{
                                backgroundColor: card.color,
                                minHeight: '100px',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                            }}
                        >
                            <h2 className="text-xl font-bold mb-2">{card.title}</h2>
                            <p className="text-sm">{card.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* floating button */}
            <button
                onClick={() => setShowForm(true)}
                className="fixed bottom-10 right-10 bg-purple-200 text-black px-5 py-3 rounded-full shadow-lg hover:bg-gray-300 transition"
            >
                + Create a Note
            </button>

            {/* Card Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-blue-100/60 flex items-center justify-center z-50">
                    <div className="bg-orange-100  rounded-lg p-6 w-full max-w-md shadow-2xl relative">
                        <button
                            className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black"
                            onClick={() => setShowForm(false)}
                        >
                            ✕
                        </button>

                        <div className="flex justify-center">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Add title"
                                className="w-64 mt-3 mb-3 p-3 border border-gray-300 rounded-full text-center shadow"
                            />
                        </div>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your note here..."
                            className="w-full mt-5 mb-5 p-2 border border-gray-300 rounded-lg resize-none"
                            rows={4}
                        />
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <label className="font-medium whitespace-nowrap">Select Note Color:</label>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-10 h-5 p-0 border-none bg-gray-300 rounded "
                                />
                            </div>
                            <button
                                onClick={handleAddCard}
                                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-400 transition"
                            >
                                Add Note
                            </button>
                        </div>


                    </div>
                </div>
            )}
        </div>
    );
};


export default Dashboard;
