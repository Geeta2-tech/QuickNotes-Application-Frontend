import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { Pipette } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';

const CardForm = ({
  title,
  setTitle,
  content,
  setContent,
  color,
  setColor,
  onAddCard,
  onClose
}) => {
  const [value, setValue] = useState(content);

  // Set default color only on initial mount
  useEffect(() => {
    if (!color) {
      setColor('#ffffff');
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Sync the Quill editor value with content
  

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }
    onAddCard();
  };

  return (
    <div className="fixed inset-0 bg-blue-100/60 flex items-center justify-center z-50">
      <div className="rounded-lg p-6 w-full max-w-md shadow-2xl relative"
        style={{ backgroundColor: color || '#fef2f2' }}>
        <button
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black"
          onClick={onClose}
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

        <div className="w-full mt-5 mb-5">
  <ReactQuill
    theme="snow"
    value={value}
    onChange={(newValue) => {
      setValue(newValue);
      setContent(newValue);
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
              <div className="relative w-6 h-6 mb-2">
                <input
                  type="color"
                  value={color || '#ffffff'}
                  onChange={(e) => setColor(e.target.value)}
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
                  onClick={() => setColor(clr)}
                  className={`w-2 h-2 p-2 rounded-full border-2 ${(color || '#ffffff') === clr ? 'border-black' : 'border-transparent'}`}
                  style={{ backgroundColor: clr }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-gray-700 text-white px-4 py-1 mt-5 rounded hover:bg-gray-400 transition"
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardForm;