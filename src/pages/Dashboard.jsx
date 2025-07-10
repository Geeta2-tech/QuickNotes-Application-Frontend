import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import Masonry from "react-masonry-css";
import EditCard from '../components/EditCard';
import CardForm from '../components/Card';

// Masonry layout breakpoints
const masonryBreakpoints = {
    default: 6,
    1024: 2,
    768: 2,
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState('#ffffff');
    const token = Cookies.get('token');
    const [updateForm, setUpdateForm] = useState({ show: false, card: null });
    const [shouldFetch, setShouldFetch] = useState(false);

    const api = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Fetch notes on component mount and when `shouldFetch` changes
    useEffect(() => {
        if (!token) {
            toast.error('Please login to access the dashboard');
            navigate('/login');
            return;
        }

        const fetchNotes = async () => {
            try {
                const res = await api.get(`/notes/get-all-by-uid`);
                setCards(res.data);
            } catch (error) {
                toast.error('Failed to load notes');
            } finally {
                setShouldFetch(false); // Reset `shouldFetch` after fetching
            }
        };

        // Initial fetch or fetch when `shouldFetch` changes
        if (shouldFetch) {
            fetchNotes();
        } else {
            fetchNotes();
        }
    }, [shouldFetch, token, navigate, api]); // Dependencies array includes relevant variables

    // Handle creating a new card
    const handleAddCard = async () => {
        if (!title || !content) {
            toast.error('Please fill in both title and content');
            return;
        }

        try {
            const res = await api.post('/notes/create', {
                title,
                content,
                color,
                userId: token,
            });

            setCards((prevCards) => [...prevCards, res.data.note]);
            setTitle('');
            setContent('');
            setColor('#ffffff');
            setShowForm(false);
            toast.success('Note created successfully');
            setShouldFetch((prev) => !prev);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create note');
        }
    };

    // Handle deleting a note
    const handleDeleteNote = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/notes/delete?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setCards(cards.filter((card) => card.id !== id));
                toast.success('Note deleted successfully');
            } else {
                toast.error('Failed to delete note');
            }
        } catch (error) {
            toast.error('Error deleting note');
        }
    };

    // Handle user logout
    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;

        try {
            const res = await axios.post('http://localhost:3000/api/users/logout', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 200) {
                Cookies.remove('token');
                toast.success('Logged out successfully');
                navigate('/login');
            } else {
                toast.error('Logout failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen p-6 bg-blue-100 relative">
            {/* User Profile and Logout Button */}
            <div className="absolute top-6 right-6 group flex flex-col items-end">
                <FaUserCircle className="text-4xl text-gray-800 cursor-pointer" />
                <button
                    onClick={handleLogout}
                    className="mt-2 bg-red-400 text-white text-sm px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    Logout
                </button>
            </div>

            {/* Dashboard Title */}
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Let's create <span className="text-yellow-500">Quick</span> Notes
            </h1>

            {/* Displaying Notes */}
            <div className="p-4">
                {Array.isArray(cards) && cards.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[200px]">
                        <span className="text-xl text-gray-500 font-semibold">
                            No notes created yet...
                        </span>
                    </div>
                ) : (
                    <Masonry
                        breakpointCols={masonryBreakpoints}
                        className="flex gap-6 w-auto"
                        columnClassName="flex flex-col gap-6"
                    >
                        {cards.map((card, index) => {
                            if (!card || typeof card !== "object") return null;
                            return (
                                <div key={index} className="relative group">
                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNote(card.id);
                                        }}
                                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        title="Delete note"
                                    >
                                        ×
                                    </button>

                                    {/* Card Content */}
                                    <div
                                        className="relative flex flex-col justify-between p-4 rounded-2xl shadow-md text-black transition-all duration-300 hover:shadow-lg"
                                        style={{
                                            backgroundColor: card?.color || "#ffffff",
                                            minHeight: "100px",
                                            maxHeight: "400px",
                                            overflow: "hidden",
                                            border: "1px solid #ccc",
                                            borderRadius: "12px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            padding: "16px",
                                            margin: "8px",
                                            fontSize: "14px",
                                            whiteSpace: "pre-wrap",
                                            wordWrap: "break-word",
                                        }}
                                        onClick={() => setUpdateForm({ show: true, card: card })}
                                    >
                                        <h2 className="text-xl font-bold mb-2">{card.title || ""}</h2>
                                        <div
                                            className="text-sm"
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: 10,
                                            }}
                                        >
                                            <div
                                                className="text-sm"
                                                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                                                dangerouslySetInnerHTML={{ __html: card.content || "" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Masonry>
                )}
            </div>

            {/* Button to Create a Note */}
            <button
                onClick={() => {
                    setTitle('');
                    setContent('');
                    setColor('#ffffff');
                    setShowForm(true);
                }}
                className="fixed bottom-10 right-10 bg-gradient-to-r from-purple-400 to-pink-400 text-black px-5 py-3 rounded-full shadow-lg hover:bg-gray-300 transition"
            >
                + Create a Note
            </button>

            {/* Card Creation Form */}
            {showForm && (
                <CardForm
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    color={color}
                    setColor={setColor}
                    onAddCard={handleAddCard}
                    onClose={() => setShowForm(false)}
                />
            )}

            {/* Edit Card Form */}
            {updateForm.show && (
                <EditCard
                    title={updateForm.card.title}
                    setTitle={setTitle}
                    content={updateForm.card.content}
                    setContent={setContent}
                    color={updateForm.card.color}
                    setColor={setColor}
                    onClose={() => setUpdateForm({ show: false, card: null })}
                    cardId={updateForm.card.id}
                    token={token}
                    setShouldFetch={setShouldFetch}
                />
            )}
        </div>
    );
};

export default Dashboard;
