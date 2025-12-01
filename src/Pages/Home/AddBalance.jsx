import React, { useState } from "react";
import axios from "axios";
import { useAppContext } from "../../components/AppContext";

const AddBalance = () => {
  const { allUsers } = useAppContext();
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("/api/user/add-balance", {
        userId,
        amount: Number(amount),
      });
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
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900">
        Add Balance to User Wallet
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select User
          </label>
          <select
            className="w-full border rounded px-3 py-2"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₦)
          </label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Balance"}
        </button>
        {message && (
          <div className="mt-3 text-center text-sm text-green-600">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddBalance;
