import React, { useState } from "react";
import axios from "axios";
import { useAppContext } from "../components/AppContext";
import SideBar from "../components/SideBar/SideBar";
import {
  IoMenu,
  IoWalletOutline,
  IoPersonOutline,
  IoBicycleOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { FiPlus, FiMinus } from "react-icons/fi";

const AddBalance = () => {
  const { allUsers, riders, vendors } = useAppContext();
  const [activeTab, setActiveTab] = useState("users");
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openNav, setOpenNav] = useState(false);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "users":
        return allUsers || [];
      case "riders":
        return riders || [];
      case "vendors":
        return vendors || [];
      default:
        return [];
    }
  };

  // Get search field name based on tab
  const getSearchField = () => {
    switch (activeTab) {
      case "users":
        return "email";
      case "riders":
        return "email";
      case "vendors":
        return "email";
      default:
        return "email";
    }
  };

  // Get display name based on tab
  const getDisplayName = (item) => {
    switch (activeTab) {
      case "users":
        return item.fullName;
      case "riders":
        return item.userName;
      case "vendors":
        return item.storeName;
      default:
        return "";
    }
  };

  // Live search for users/riders/vendors by email
  const handleUserSearch = (e) => {
    const val = e.target.value;
    setUserSearch(val);
    setSelectedUser(null);
    setMessage("");
    if (val.length < 2) {
      setUserResults([]);
      return;
    }
    const currentData = getCurrentData();
    const filtered = currentData.filter((item) =>
      item[getSearchField()].toLowerCase().includes(val.toLowerCase())
    );
    setUserResults(filtered);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUserSearch(user.email);
    setUserResults([]);
    setMessage("");
  };

  // Reset state when changing tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setUserSearch("");
    setUserResults([]);
    setSelectedUser(null);
    setAmount("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (!selectedUser) throw new Error("Select an entity");

      let endpoint = "";
      let payload = {};

      switch (activeTab) {
        case "users":
          endpoint = `${
            import.meta.env.VITE_REACT_APP_API
          }/api/users/admin/add-funds`;
          payload = { userId: selectedUser._id, amount: Number(amount) };
          break;
        case "riders":
          endpoint = `${import.meta.env.VITE_REACT_APP_API}/api/riders/${
            selectedUser._id
          }/add-funds`;
          payload = { amount: Number(amount) };
          break;
        case "vendors":
          endpoint = `${import.meta.env.VITE_REACT_APP_API}/api/vendors/${
            selectedUser._id
          }/add-funds`;
          payload = { amount: Number(amount) };
          break;
        default:
          throw new Error("Invalid tab");
      }

      const res = await axios.post(endpoint, payload);
      const newBalance =
        res.data.user?.availableBal ||
        res.data.rider?.availableBal ||
        res.data.vendor?.availableBal;
      setMessage(
        res.data.success || res.data.message
          ? `Balance added! New balance: ₦${newBalance?.toLocaleString()}`
          : "Failed to add balance."
      );

      // Refresh the selected user data
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const handleRemoveFunds = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (!selectedUser) throw new Error("Select an entity");

      let endpoint = "";
      let payload = {};

      switch (activeTab) {
        case "users":
          endpoint = `${
            import.meta.env.VITE_REACT_APP_API
          }/api/users/admin/remove-funds`;
          payload = { userId: selectedUser._id, amount: Number(amount) };
          break;
        case "riders":
          endpoint = `${import.meta.env.VITE_REACT_APP_API}/api/riders/${
            selectedUser._id
          }/remove-funds`;
          payload = { amount: Number(amount) };
          break;
        case "vendors":
          endpoint = `${import.meta.env.VITE_REACT_APP_API}/api/vendors/${
            selectedUser._id
          }/remove-funds`;
          payload = { amount: Number(amount) };
          break;
        default:
          throw new Error("Invalid tab");
      }

      const res = await axios.post(endpoint, payload);
      const newBalance =
        res.data.user?.availableBal ||
        res.data.rider?.availableBal ||
        res.data.vendor?.availableBal;
      setMessage(
        res.data.success || res.data.message
          ? `Funds removed! New balance: ₦${newBalance?.toLocaleString()}`
          : "Failed to remove funds."
      );

      // Refresh the selected user data
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="flex w-[100%] justify-between min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {openNav && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpenNav(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300
            ${openNav ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 w-[270px] md:w-[240px]`}
      >
        <SideBar setOpenNav={setOpenNav} />
      </div>

      <div className="flex-1 md:ml-[240px] w-full min-h-screen overflow-y-auto">
        <div className="md:p-6 px-5 mt-3 pb-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4 items-center">
              <button
                className="md:hidden flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-white transition-all shadow-sm"
                onClick={() => setOpenNav(true)}
              >
                <IoMenu size={18} className="text-blue-700" />
              </button>
              <div>
                <h1 className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-blue-900 to-purple-600 bg-clip-text text-transparent">
                  Balance Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage wallet balances for users, riders, and vendors
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={() => handleTabChange("users")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "users"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <IoPersonOutline size={20} />
                Users
              </button>
              <button
                onClick={() => handleTabChange("riders")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "riders"
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <IoBicycleOutline size={20} />
                Riders
              </button>
              <button
                onClick={() => handleTabChange("vendors")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "vendors"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <IoStorefrontOutline size={20} />
                Vendors
              </button>
            </div>
          </div>

          {/* Add Funds Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 overflow-visible">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div
                className={`p-2 rounded-xl ${
                  activeTab === "users"
                    ? "bg-blue-100 text-blue-700"
                    : activeTab === "riders"
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                <FiPlus size={20} />
              </div>
              Add Funds
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4 overflow-visible"
            >
              {/* Search Input */}
              <div className="flex-1 min-w-[240px] relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search by Email
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                  value={userSearch}
                  onChange={handleUserSearch}
                  placeholder={`Search ${activeTab}...`}
                  autoComplete="off"
                  required
                  disabled={loading}
                />
                {userResults.length > 0 && !selectedUser && (
                  <div className="relative left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-[999999] max-h-60 overflow-y-auto mt-2">
                    {userResults.map((item) => (
                      <div
                        key={item._id}
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 last:border-0 transition"
                        onClick={() => handleSelectUser(item)}
                      >
                        <div className="font-medium text-gray-800">
                          {getDisplayName(item)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.email}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedUser && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-gray-800">
                      {getDisplayName(selectedUser)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedUser.email}
                    </div>
                    <div className="text-sm font-bold text-blue-600 mt-1">
                      Current Balance: ₦
                      {selectedUser.availableBal?.toLocaleString?.() ?? 0}
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Input */}
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                  placeholder="Enter amount"
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap ${
                    activeTab === "users"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      : activeTab === "riders"
                      ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} />
                      Add Funds
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Remove Funds Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 overflow-visible">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-100 text-red-700">
                <FiMinus size={20} />
              </div>
              Remove Funds
            </h2>

            <form
              onSubmit={handleRemoveFunds}
              className="flex flex-col md:flex-row gap-4 overflow-visible"
            >
              {/* Search Input */}
              <div className="flex-1 min-w-[240px] relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search by Email
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                  value={userSearch}
                  onChange={handleUserSearch}
                  placeholder={`Search ${activeTab}...`}
                  autoComplete="off"
                  required
                  disabled={loading}
                />
                {userResults.length > 0 && !selectedUser && (
                  <div className="relative left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] max-h-60 overflow-y-auto mt-2">
                    {userResults.map((item) => (
                      <div
                        key={item._id}
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 last:border-0 transition"
                        onClick={() => handleSelectUser(item)}
                      >
                        <div className="font-medium text-gray-800">
                          {getDisplayName(item)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.email}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedUser && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-gray-800">
                      {getDisplayName(selectedUser)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedUser.email}
                    </div>
                    <div className="text-sm font-bold text-blue-600 mt-1">
                      Current Balance: ₦
                      {selectedUser.availableBal?.toLocaleString?.() ?? 0}
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Input */}
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                  placeholder="Enter amount"
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  disabled={loading || !selectedUser}
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Removing...
                    </>
                  ) : (
                    <>
                      <FiMinus size={18} />
                      Remove Funds
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl font-semibold text-center transition-all ${
                message.startsWith("Error")
                  ? "bg-red-50 text-red-700 border-2 border-red-200"
                  : "bg-green-50 text-green-700 border-2 border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div
                  className={`w-1 h-6 rounded-full ${
                    activeTab === "users"
                      ? "bg-blue-600"
                      : activeTab === "riders"
                      ? "bg-green-600"
                      : "bg-purple-600"
                  }`}
                />
                All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} &
                Balances
              </h2>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow"
              >
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {activeTab === "users"
                        ? "Name"
                        : activeTab === "riders"
                        ? "Rider Name"
                        : "Store Name"}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      University
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Balance (₦)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {getCurrentData()?.length > 0 ? (
                    getCurrentData().map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {getDisplayName(item)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.university || "N/A"}
                        </td>
                        <td
                          className={`px-6 py-4 text-sm font-bold ${
                            activeTab === "users"
                              ? "text-blue-700"
                              : activeTab === "riders"
                              ? "text-green-700"
                              : "text-purple-700"
                          }`}
                        >
                          ₦{item.availableBal?.toLocaleString() ?? 0}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-gray-300 text-5xl">
                            {activeTab === "users"
                              ? "👥"
                              : activeTab === "riders"
                              ? "🚴"
                              : "🏪"}
                          </span>
                          <p className="text-gray-500 font-semibold text-lg">
                            No {activeTab} found
                          </p>
                          <p className="text-sm text-gray-400">
                            {activeTab.charAt(0).toUpperCase() +
                              activeTab.slice(1)}{" "}
                            will appear here once registered
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddBalance;
