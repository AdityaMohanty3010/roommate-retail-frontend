import React, { useState, useEffect } from 'react';
import { createGroup, joinGroup, getGroupInfo } from '../services/groupservice';

const GroupDashboard = () => {
  const [groupName, setGroupName] = useState('');
  const [groupInfo, setGroupInfo] = useState(null);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username') || 'Anonymous';

  useEffect(() => {
    getGroupInfo()
      .then(setGroupInfo)
      .catch((err) => setError(err.message));
  }, []);

  const handleCreate = async () => {
    try {
      const info = await createGroup(groupName);
      setGroupInfo(info);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJoin = async () => {
    try {
      const info = await joinGroup(groupName);
      setGroupInfo(info);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-indigo-400">👥 Group Setup</h1>

        {error && <p className="text-red-400 text-center mb-6">{error}</p>}

        {/* ✅ Group Info Section */}
        {groupInfo ? (
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl shadow-md p-6 mb-10">
            <h2 className="text-2xl font-semibold text-blue-300 mb-4">
              🏷️ Group: {groupInfo.groupName}
            </h2>
            <div className="space-y-2">
              {groupInfo.members.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-gray-800 border border-gray-700 px-4 py-2 rounded-md text-white"
                >
                  👤 {m}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 mb-10">You are not part of any group yet.</p>
        )}

        {/* ✅ Create/Join Group Section */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Create or Join a Group</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md text-white font-medium transition"
            >
              ➕ Create
            </button>
            <button
              onClick={handleJoin}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-white font-medium transition"
            >
              🔗 Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDashboard;
