import React from 'react';
import { addItemToCart } from '../services/cartservice';

const ShoppingList = ({ data }) => {
  const username = localStorage.getItem('username') || 'Anonymous';

  const handleAdd = async (item, category) => {
    try {
      await addItemToCart({ item, category, quantity: 1, username });
      alert(`${item} added to cart`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!data || !data.categories || data.categories.length === 0) {
    return <p className="mt-4 text-red-400 text-center">❌ No shopping list found.</p>;
  }

  return (
    <div className="mt-8 space-y-6">
      {data.categories.map((category, index) => (
        <div
          key={index}
          className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-purple-300 mb-4">📦 {category.name}</h2>
          <ul className="space-y-3 text-white">
            {category.items.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-900 border border-gray-700 rounded-md px-4 py-2"
              >
                <span>✅ {item}</span>
                <button
                  onClick={() => handleAdd(item, category.name)}
                  className="bg-green-600 hover:bg-green-500 text-white text-sm px-3 py-1 rounded-md transition"
                >
                  ➕ Add to Cart
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ShoppingList;
