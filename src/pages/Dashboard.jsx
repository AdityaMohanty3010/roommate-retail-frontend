import React, { useEffect, useState } from 'react';
import { getGroupInfo, joinGroup } from '../services/groupservice';
import { getCart } from '../services/cartservice';

const Dashboard = () => {
  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupNameInput, setGroupNameInput] = useState('');
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await getGroupInfo();
      setGroupInfo(info);

      const cart = await getCart();
      const total = cart.reduce((sum, item) => {
        const itemTotal = item.price ? item.price * item.quantity : 0;
        return sum + itemTotal;
      }, 0);
      setTotalCost(total);
    } catch (err) {
      setGroupInfo(null);
      setError(err.message || 'Error fetching group info');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupNameInput.trim()) return;
    try {
      const response = await joinGroup(groupNameInput);
      setGroupInfo(response);
      setGroupNameInput('');
      setError(null);
      fetchData();
    } catch (err) {
      setError(err.message || 'Join group failed');
    }
  };

  const copyGroupID = () => {
    navigator.clipboard.writeText(groupInfo.groupName);
    alert('Group ID copied!');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const perPerson = groupInfo?.members?.length
    ? (totalCost / groupInfo.members.length).toFixed(2)
    : '0.00';

  if (loading)
    return <p className="text-center mt-10 text-blue-300">⏳ Loading group info...</p>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 sm:px-8 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-400">🏠 RoomMate Dashboard</h1>

      {error && <p className="text-red-400 text-center mb-6">{error}</p>}

      <div className="max-w-5xl mx-auto space-y-8">
        {/* 🧑‍🤝‍🧑 Group Info */}
        <div className="bg-[#1a1a1a] border border-gray-700 p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              👥 Group: <span className="text-indigo-300">{groupInfo?.groupName || 'N/A'}</span>
            </h2>
            {groupInfo && (
              <button
                onClick={copyGroupID}
                className="bg-gray-800 text-blue-400 text-sm px-3 py-1 rounded hover:bg-gray-700 transition"
              >
                📋 Copy ID
              </button>
            )}
          </div>

          {groupInfo ? (
            <>
              <h3 className="text-gray-300 mb-3">Roommates</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupInfo.members.map((member, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-900 border border-gray-700 px-4 py-3 rounded-md"
                  >
                    <span className="text-white text-base flex items-center gap-2">👤 {member}</span>
                    <button className="text-sm text-blue-400 hover:underline">Edit</button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center mt-6">
              <p className="mb-4 text-gray-400"> Shop better together. Join a group and simplify shared expenses...</p>
              <input
                type="text"
                placeholder="Enter group name"
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                className="w-full max-w-xs mx-auto block bg-gray-900 border border-gray-700 rounded-md px-4 py-2 mb-3 text-white"
              />
              <button
                onClick={handleJoinGroup}
                className="w-full max-w-xs mx-auto block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition"
              >
                Join Group
              </button>
            </div>
          )}
        </div>

        {/* 📊 Summary */}
        {groupInfo && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-inner p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">📊 Shared Expense Summary</h3>
            <p className="text-gray-400">🧾 Total Cost</p>
            <p className="text-3xl font-bold text-indigo-400 mb-2">₹{totalCost.toFixed(2)}</p>
            <p className="text-gray-400">💸 Avg per Roommate</p>
            <p className="text-2xl font-bold text-green-400 mt-1">₹{perPerson}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
