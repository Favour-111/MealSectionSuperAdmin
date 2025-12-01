import React, { useState } from "react";
import axios from "axios";
import { useAppContext } from "../components/AppContext";
import SideBar from "../components/SideBar/SideBar";
import { IoMenu, IoWalletOutline } from "react-icons/io5";

const AddBalance = () => {
  const { allUsers } = useAppContext();
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openNav, setOpenNav] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API}/api/users/add-balance`,
        {
          userId,
          amount: Number(amount),
        }
      );
      setMessage(
        res.data.success
          ? `Balance added! New balance: ₦${res.data.user.availableBal}`
          : "Failed to add balance."
      );
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="flex w-[100%] justify-between min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4 items-center">
              <button
                className="md:hidden flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-white transition-all shadow-sm"
                onClick={() => setOpenNav(true)}
              >
                <IoMenu size={18} className="text-blue-700" />
              </button>
              <div>
                <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-900 to-purple-600 bg-clip-text text-transparent">
                  Add Balance to User Wallet
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Top up any user's wallet instantly
                </p>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="w-full mb-8 bg-white/90 p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-end gap-4 sm:gap-6 md:gap-8"
          >
            <div className="flex-1 min-w-[220px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-1">
                  <IoWalletOutline size={16} />
                </span>
                Select User
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              >
                <option value="">-- Select User --</option>
                {allUsers?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="inline-block bg-purple-100 text-purple-700 rounded-full p-1">
                  ₦
                </span>
                Amount
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
                placeholder="Enter amount"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 sm:py-3 sm:px-8 rounded-xl font-bold text-base shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed h-fit w-full md:w-fit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </>
              ) : (
                <>
                  <IoWalletOutline size={20} />
                  Add Balance
                </>
              )}
            </button>
            {message && (
              <div
                className={`w-full text-center text-sm font-semibold rounded-lg px-4 py-2 mt-2
                  ${message.startsWith('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}
                `}
              >
                {message}
              </div>
            )}
          </form>
          <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-gray-500 rounded-full" />
            All Users & Balances
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Name
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
                {allUsers?.length > 0 ? (
                  allUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.university}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-700">
                        ₦{user.availableBal?.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-300 text-3xl">💳</span>
                        <p className="text-gray-500 font-medium">
                          No users found
                        </p>
                        <p className="text-sm text-gray-400">
                          Users will appear here once registered
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
  );
};
export default AddBalance;
