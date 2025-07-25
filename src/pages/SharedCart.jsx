import React, { useEffect, useState } from "react";
import {
  getCart,
  addItemToCart,
  deleteItemFromCart,
} from "../services/cartservice";
import { getGroupInfo } from "../services/groupservice";
import { useNavigate } from "react-router-dom";

const SharedCart = () => {
  const [cart, setCart] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [category, setCategory] = useState("Produce");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Anonymous";

  useEffect(() => {
    fetchCart();
    fetchGroup();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      if (!Array.isArray(data)) throw new Error("Cart data is not an array");
      setCart(data);
    } catch (err) {
      setError(err.message);
      setCart([]);
    }
  };

  const fetchGroup = async () => {
    try {
      const data = await getGroupInfo();
      setGroupInfo(data);
    } catch (err) {
      console.error("Error fetching group info:", err.message);
    }
  };

  const handleAdd = async () => {
    if (!newItem.trim()) return;
    try {
      await addItemToCart({
        item: newItem,
        category,
        quantity,
        username,
        price,
      });
      setNewItem("");
      setQuantity(1);
      setPrice(0);
      await fetchCart();
    } catch (err) {
      setError(err.message || "Failed to add item.");
    }
  };

  const handleDelete = async (itemName) => {
    try {
      await deleteItemFromCart(itemName);
      await fetchCart();
    } catch (err) {
      setError(err.message || "Failed to remove item.");
    }
  };

  const handlePayment = () => {
    navigate("/payment", { state: { amount: totalCost.toFixed(2) } });
  };

  const categorizedCart = Array.isArray(cart)
    ? cart.reduce((acc, item) => {
        const cat = item.category || "Uncategorized";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      }, {})
    : {};

  const totalCost = cart.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0
  );

  const totalMembers = groupInfo?.members?.length || 1;
  const costPerPerson = (totalCost / totalMembers).toFixed(2);

  const contributions = cart.reduce((acc, item) => {
    const contributor = item.added_by || "Anonymous";
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    acc[contributor] = (acc[contributor] || 0) + itemTotal;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 md:px-10 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-400 mb-8">
        🛒 Shared Shopping Cart
      </h1>

      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      {/* Add Item Section */}
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-5 mb-10 shadow-sm max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">➕ Add New Item</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Item name"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400"
          />
          <input
            type="number"
            min="1"
            placeholder="Qty"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
            placeholder="₹ Price"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
          >
            <option>Produce</option>
            <option>Dairy</option>
            <option>Bakery</option>
            <option>Beverages</option>
            <option>Frozen</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Side-by-side layout */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Cart Items Display */}
        <div className="flex-1">
          {Object.keys(categorizedCart).length === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              🧺 Cart is empty. Add something!
            </p>
          ) : (
            Object.entries(categorizedCart).map(([cat, items]) => (
              <div key={cat} className="mb-8">
                <h3 className="text-xl font-bold mb-3 text-purple-300">
                  📦 {cat}
                </h3>
                <ul className="space-y-3">
                  {items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center bg-gray-900 border border-gray-700 px-4 py-3 rounded-md"
                    >
                      <div>
                        ✅ <strong>{item.item}</strong> ({item.quantity}) — ₹
                        {item.price || 0} × 👤 <em>{item.added_by}</em>
                      </div>
                      <button
                        onClick={() => handleDelete(item.item)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        ❌ Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary */}
        <div className="w-full md:w-80 bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-inner text-center h-fit">
          <h2 className="text-2xl font-semibold mb-4 text-white">🧾 Cart Summary</h2>
          <p className="text-lg text-gray-300">
            Total Cost: <strong>₹{totalCost.toFixed(2)}</strong>
          </p>
          <p className="text-lg text-gray-300">
            Roommates: <strong>{totalMembers}</strong>
          </p>
          <p className="text-lg text-green-400 mb-4">
            Average: <strong>₹{costPerPerson}</strong>
          </p>

          <div className="text-left text-sm text-gray-300">
            <p className="font-semibold underline mb-2">💰 Contributions:</p>
            {Object.entries(contributions).map(([user, amount]) => (
              <p key={user}>👤 {user}: ₹{amount.toFixed(2)}</p>
            ))}
          </div>

          <button
            onClick={handlePayment}
            disabled={totalCost === 0}
            className={`mt-6 ${
              totalCost === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500"
            } text-white px-6 py-3 rounded-md text-lg font-semibold transition`}
          >
            💳 Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedCart;
