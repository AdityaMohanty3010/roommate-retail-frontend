import React, { useState } from 'react';
import { FaSpinner, FaPencilAlt } from 'react-icons/fa';

const InputForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await onSubmit(text);
      setText('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
      {/* Textarea with icon */}
      <div className="relative rounded-lg shadow-lg border border-gray-700 bg-[#1a1a1a]">
        <FaPencilAlt className="absolute top-4 left-4 text-gray-500" />
        <textarea
          className="w-full p-4 pl-10 bg-transparent text-white placeholder-gray-500 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={4}
          placeholder="E.g. We need fruits, snacks for the weekend, and cleaning supplies under ₹1000..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full md:w-auto flex items-center justify-center px-6 py-2 rounded-lg shadow-md font-semibold text-white transition duration-200 ${
          loading
            ? 'bg-indigo-700 cursor-not-allowed opacity-70'
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Generating...
          </>
        ) : (
          <>🚀 Generate Shopping List</>
        )}
      </button>
    </form>
  );
};

export default InputForm;
