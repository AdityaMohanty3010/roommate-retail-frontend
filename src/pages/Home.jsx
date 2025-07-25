import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import { fetchHuddleList } from '../services/huddleService';
import { addItemToCart } from '../services/cartservice';

const Home = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username') || 'Anonymous';

  const handleSubmit = async (text) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchHuddleList(text);
      setShoppingList(data.categories || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch list');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (itemObj, category) => {
    try {
      await addItemToCart({
        item: itemObj.name,
        category,
        quantity: 1,
        username,
        price: itemObj.price || 0
      });
      alert(`${itemObj.name} added to cart`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-4 sm:px-6 lg:px-12 py-10 text-white">
      {/* 🧠 AI & Branding */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-copper text-indigo-400 mb-3">🛍️ RoomMate Retail</h1>
        <p className="text-gray-400 text-lg font-cursive">
          Collaborate. Shop Smart. Save Together.
        </p>
      </div>

      {/* 🌟 Input & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: AI Input */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-700 shadow-md">
          <h2 className="text-2xl font-copper text-blue-300 mb-3">🤖WallyBot</h2>
          <p className="text-gray-400 mb-4 font-cursive">
            Tell the AI what your group needs — groceries, snacks, essentials — and get a categorized list.
          </p>
          <InputForm onSubmit={handleSubmit} />
          {loading && <p className="text-blue-400 mt-4 text-center">⏳ Generating suggestions...</p>}
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>

        {/* Right: AI Output */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-700 shadow-md overflow-y-auto max-h-[80vh]">
          <h2 className="text-2xl font-copper text-purple-300 mb-4 text-center">
            🎯Shopping Suggestions
          </h2>

          {shoppingList.length === 0 ? (
            <p className="text-gray-500 text-center font-cursive">No suggestions yet. Start by submitting a request. 🤖</p>
          ) : (
            <div className="space-y-6">
              {shoppingList.map(({ name: category, items }) => (
                <div key={category} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold font-copper text-indigo-300 mb-3">
                    📦 {category}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center bg-gray-900 px-4 py-2 rounded-md border border-gray-700"
                      >
                        <span>✅ {item.name} — ₹{item.price}</span>
                        <button
                          onClick={() => handleAddToCart(item, category)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded transition"
                        >
                          ➕ Add
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
