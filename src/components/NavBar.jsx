import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("group");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="bg-[#0f0f0f]/80 backdrop-blur-md border-b border-gray-800 text-white px-6 py-4 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className="text-2xl font-bold text-indigo-400 cursor-pointer tracking-wide"
          onClick={() => navigate("/")}
        >
          🛍️ RoomMate Retail
        </div>

        <div className="space-x-2 flex flex-wrap items-center justify-end text-sm">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md border border-gray-700 transition"
          >
            🏡 Home
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md border border-gray-700 transition"
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => navigate("/group")}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md border border-gray-700 transition"
          >
            👥 Group
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md border border-gray-700 transition"
          >
            🛒 Cart
          </button>

          {!token ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition"
              >
                🔐 Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition"
              >
                📝 Signup
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition"
            >
              🚪 Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
