import React, { useState, useEffect } from 'react';
import { Pipette } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles

const EditCard = ({
  title: initialTitle,
  setTitle,
  content: initialContent,
  setContent,
  color: initialColor,
  setColor,
  onClose,
  cardId,
  token,
  setShouldFetch, // New prop to update the state after update
}) => {
  // Local state to manage the form inputs
  const [localTitle, setLocalTitle] = useState(initialTitle || '');
  const [localContent, setLocalContent] = useState(initialContent || '');
  const [localColor, setLocalColor] = useState(initialColor || '#ffffff');

  // Update local state when props change
  useEffect(() => {
    setLocalTitle(initialTitle || '');
    setLocalContent(initialContent || '');
    setLocalColor(initialColor || '#ffffff');
  }, [initialTitle, initialContent, initialColor]);

  // API setup for updating the card
  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const handleUpdate = async () => {
    if (!localTitle.trim() || !localContent.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    if (!cardId) {
      toast.error('Card ID is missing');
      return;
    }

    try {
      await api.put(`/notes/update?id=${cardId}`, {
        title: localTitle.trim(),
        content: localContent.trim(),
        color: localColor,
      });

      // Update parent component state
      if (setTitle) setTitle(localTitle.trim());
      if (setContent) setContent(localContent.trim());
      if (setColor) setColor(localColor);

      toast.success('Note updated successfully');

      // Toggle shouldFetch to trigger re-fetch
      setShouldFetch(prev => !prev);

      // Close the form
      onClose();
    } catch (error) {
      console.error('Error updating note:', error);
      if (error.response) {
        toast.error(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        toast.error('No response from server. Please check your connection.');
      } else {
        toast.error('Failed to update note: ' + error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-100/60 flex items-center justify-center z-50">
      <div
        className="rounded-lg p-6 w-full max-w-md shadow-2xl relative"
        style={{ backgroundColor: localColor || '#fef2f2' }}
      >
        <button
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex justify-center">
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            placeholder="Add title"
            className="w-64 mt-3 mb-3 p-3 border border-gray-300 rounded-full text-center shadow"
          />
        </div>

        {/* ReactQuill for Markdown-like editing */}
        <div className="w-full mt-5 mb-5">
          <ReactQuill
            theme="snow"
            value={localContent}
            onChange={(newValue) => {
              setLocalContent(newValue);
            }}
            placeholder="Write your note here..."
            className="w-full border border-gray-300 rounded-lg"
            style={{
              maxHeight: '300px',  // Adjust height as needed
              overflowY: 'auto',  // Enable vertical scrolling
            }}
            modules={{
              toolbar: [
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline', 'strike'],
                ['link'],

                [{ 'color': [] }, { 'background': [] }],
                ['image'],
              ],
            }}
          />
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <label className="font-medium mb-1 block">Select Note Color:</label>
            <div className="flex gap-2 flex-wrap items-center">
              {/* Color Picker with Pipette */}
              <div className="relative w-6 h-6 mb-2">
                <input
                  type="color"
                  value={localColor}
                  onChange={(e) => setLocalColor(e.target.value)}
                  className="w-full h-full rounded-full border-2 border-black cursor-pointer appearance-none p-0"
                />
                <Pipette className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-gray-800 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {[
                '#ffffff', '#f28b82', '#fbbc04', '#fff475',
                '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb'
              ].map((clr) => (
                <button
                  key={clr}
                  onClick={() => setLocalColor(clr)}
                  className={`w-2 h-2 p-2 rounded-full border-2 ${localColor === clr ? 'border-black' : 'border-transparent'}`}
                  style={{ backgroundColor: clr }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="bg-gray-700 text-white px-4 py-1 mt-5 rounded hover:bg-gray-400 transition"
          >
            Update Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCard;
