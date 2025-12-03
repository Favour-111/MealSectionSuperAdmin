import React, { useState, useEffect, useMemo } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { IoMenu, IoCheckmark, IoClose } from "react-icons/io5";
import { SlBell } from "react-icons/sl";
import { MdPending, MdAttachMoney } from "react-icons/md";
import { FiClock } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../Home/Home.css";
import { CardsSkeleton } from "../../components/ui/Skeleton";

const WithDraw = () => {
  const [openNav, setOpenNav] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [riders, setRiders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: "", message: "" });
  const [pendingPage, setPendingPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 10;

  const API = import.meta.env.VITE_REACT_APP_API;

  // 🟢 Fetch both Rider and Vendor withdrawals
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [riderRes, vendorRes, allRidersRes, allVendorsRes] =
          await Promise.all([
            axios.get(`${API}/api/riders/withdraw`),
            axios.get(`${API}/api/vendors/withdrawals`),
            axios.get(`${API}/api/riders/allRiders`),
            axios.get(`${API}/api/vendors/all`),
          ]);

        setRiders(allRidersRes.data || []);
        setVendors(allVendorsRes.data || []);

        // Helper to get university by id
        const getRiderUniversity = (riderId) => {
          const rider = (allRidersRes.data || []).find(
            (r) => r._id === riderId
          );
          return rider?.university || "N/A";
        };
        const getVendorUniversity = (vendorId) => {
          const vendor = (allVendorsRes.data || []).find(
            (v) => v._id === vendorId
          );
          return vendor?.university || "N/A";
        };

        // Normalize both data sources
        const riderData = riderRes.data.map((r) => ({
          _id: r._id,
          initiator: r.riderName || "Unknown Rider",
          role: "Rider",
          amount: r.amount,
          status: r.status, // could be true, false, or null
          date: new Date(r.date || r.createdAt).toLocaleDateString(),
          type: "rider",
          university: getRiderUniversity(r.riderId),
        }));

        const vendorData = (
          vendorRes.data.withdrawals ||
          vendorRes.data ||
          []
        ).map((v) => ({
          _id: v._id,
          initiator: v.vendorName || "Unknown Vendor",
          role: "Vendor",
          amount: v.amount,
          status: v.status,
          date: new Date(v.createdAt).toLocaleDateString(),
          type: "vendor",
          university: getVendorUniversity(v.vendorId?._id || v.vendorId),
        }));

        setWithdrawals([...riderData, ...vendorData]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch withdrawals");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleStatusUpdate = async (id, action, type) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: action }));
      const statusValue = action === "Completed"; // true or false

      if (type === "rider") {
        await axios.patch(`${API}/api/riders/withdraw/rider/${id}`, {
          status: statusValue,
        });
      } else {
        await axios.put(`${API}/api/vendors/withdrawals/${id}/status`, {
          status: statusValue,
        });
      }

      // Update UI instantly
      setWithdrawals((prev) =>
        prev.map((w) => (w._id === id ? { ...w, status: statusValue } : w))
      );

      const item = withdrawals.find((w) => w._id === id);
      const prettyAmount = item?.amount
        ? `₦${Number(item.amount).toLocaleString()}`
        : "";
      const title =
        action === "Completed" ? "Withdrawal Accepted" : "Withdrawal Rejected";
      const message = item
        ? `${item.role} ${item.initiator} - ${prettyAmount}`
        : "Status updated successfully";
      setSuccessInfo({ title, message });
      setShowSuccessModal(true);
      toast.success(title);
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  // 🟡 Separate withdrawals by status and reverse to show newest first
  const pendingWithdrawals = [...withdrawals]
    .filter((w) => w.status === null || w.status === undefined)
    .reverse();

  const completedOrRejected = [...withdrawals]
    .filter((w) => w.status === true || w.status === false)
    .reverse();

  // Pagination for pending withdrawals
  const pendingTotalPages = Math.ceil(pendingWithdrawals.length / itemsPerPage);
  const paginatedPending = pendingWithdrawals.slice(
    (pendingPage - 1) * itemsPerPage,
    pendingPage * itemsPerPage
  );

  // Pagination for transaction history
  const historyTotalPages = Math.ceil(
    completedOrRejected.length / itemsPerPage
  );
  const paginatedHistory = completedOrRejected.slice(
    (historyPage - 1) * itemsPerPage,
    historyPage * itemsPerPage
  );

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalAmount = withdrawals.reduce(
      (sum, w) => sum + (w.amount || 0),
      0
    );
    const completedAmount = withdrawals
      .filter((w) => w.status === true)
      .reduce((sum, w) => sum + (w.amount || 0), 0);
    const pendingAmount = pendingWithdrawals.reduce(
      (sum, w) => sum + (w.amount || 0),
      0
    );
    const rejectedAmount = withdrawals
      .filter((w) => w.status === false)
      .reduce((sum, w) => sum + (w.amount || 0), 0);

    return {
      total: totalAmount,
      completed: completedAmount,
      pending: pendingAmount,
      rejected: rejectedAmount,
    };
  }, [withdrawals, pendingWithdrawals]);

  return (
    <>
      <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        {/* Sidebar overlay for mobile */}
        {openNav && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setOpenNav(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300 ${
            openNav ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 w-[270px] md:w-[240px]`}
        >
          <SideBar setOpenNav={setOpenNav} />
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-[240px] w-full overflow-y-auto">
          <div className="md:p-6 px-5 mt-3 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-4 items-center">
                <button
                  className="md:hidden flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-white transition-all shadow-sm"
                  onClick={() => setOpenNav(true)}
                >
                  <IoMenu size={18} className="text-gray-700" />
                </button>
                <div>
                  <h1 className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Withdrawal Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Review and approve withdrawal requests from vendors and
                    riders
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Refresh
              </button>
            </div>

            {/* Summary Cards */}
            {loading ? (
              <CardsSkeleton />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <MdAttachMoney className="text-white/90" size={18} />
                      <p className="text-xs font-medium text-white/90">
                        Total Amount
                      </p>
                    </div>
                    <p className="text-2xl font-bold">
                      ₦{summaryStats.total.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <IoCheckmark className="text-white/90" size={18} />
                      <p className="text-xs font-medium text-white/90">
                        Completed
                      </p>
                    </div>
                    <p className="text-2xl font-bold">
                      ₦{summaryStats.completed.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <FiClock className="text-white/90" size={18} />
                      <p className="text-xs font-medium text-white/90">
                        Pending
                      </p>
                    </div>
                    <p className="text-2xl font-bold">
                      ₦{summaryStats.pending.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <IoClose className="text-white/90" size={18} />
                      <p className="text-xs font-medium text-white/90">
                        Rejected
                      </p>
                    </div>
                    <p className="text-2xl font-bold">
                      ₦{summaryStats.rejected.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Withdrawals Table */}
            <div className="mt-7">
              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-amber-500 rounded-full" />
                Pending Withdrawals
              </h2>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Initiator
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        University
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-8 bg-gray-200 rounded w-32"></div>
                          </td>
                        </tr>
                      ))
                    ) : pendingWithdrawals.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <FiClock size={36} className="text-gray-300" />
                            <p className="text-gray-500 font-medium">
                              No pending withdrawals
                            </p>
                            <p className="text-sm text-gray-400">
                              New withdrawal requests will appear here
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedPending.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.date}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {item.initiator}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {item.university || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                item.role === "Rider"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ₦{item.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    item._id,
                                    "Completed",
                                    item.type
                                  )
                                }
                                disabled={Boolean(actionLoading[item._id])}
                                className={`px-4 py-1.5 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-2 ${
                                  actionLoading[item._id]
                                    ? "bg-emerald-400/60 cursor-not-allowed"
                                    : "bg-emerald-500 hover:bg-emerald-600"
                                }`}
                              >
                                {actionLoading[item._id] === "Completed" ? (
                                  <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                  </svg>
                                ) : (
                                  <IoCheckmark size={14} />
                                )}
                                {actionLoading[item._id] === "Completed"
                                  ? "Accepting..."
                                  : "Accept"}
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    item._id,
                                    "Rejected",
                                    item.type
                                  )
                                }
                                disabled={Boolean(actionLoading[item._id])}
                                className={`px-4 py-1.5 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-2 ${
                                  actionLoading[item._id]
                                    ? "bg-red-400/60 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600"
                                }`}
                              >
                                {actionLoading[item._id] === "Rejected" ? (
                                  <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                  </svg>
                                ) : (
                                  <IoClose size={14} />
                                )}
                                {actionLoading[item._id] === "Rejected"
                                  ? "Rejecting..."
                                  : "Reject"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination for Pending Withdrawals */}
              {pendingTotalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-4">
                  <p className="text-sm text-gray-600">
                    Showing {(pendingPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      pendingPage * itemsPerPage,
                      pendingWithdrawals.length
                    )}{" "}
                    of {pendingWithdrawals.length} pending withdrawals
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setPendingPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={pendingPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {[...Array(pendingTotalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPendingPage(i + 1)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                            pendingPage === i + 1
                              ? "bg-amber-500 text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setPendingPage((prev) =>
                          Math.min(prev + 1, pendingTotalPages)
                        )
                      }
                      disabled={pendingPage === pendingTotalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Transaction History */}
            <div className="mt-7">
              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gray-500 rounded-full" />
                Transaction History
              </h2>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Initiator
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        University
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                        </tr>
                      ))
                    ) : completedOrRejected.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <MdPending size={36} className="text-gray-300" />
                            <p className="text-gray-500 font-medium">
                              No transaction history
                            </p>
                            <p className="text-sm text-gray-400">
                              Completed and rejected withdrawals will appear
                              here
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedHistory.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.date}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {item.initiator}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {item.university || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                item.role === "Rider"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ₦{item.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                item.status === true
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.status === true ? "Completed" : "Rejected"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination for Transaction History */}
              {historyTotalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-4">
                  <p className="text-sm text-gray-600">
                    Showing {(historyPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      historyPage * itemsPerPage,
                      completedOrRejected.length
                    )}{" "}
                    of {completedOrRejected.length} transactions
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setHistoryPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={historyPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {[...Array(historyTotalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setHistoryPage(i + 1)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                            historyPage === i + 1
                              ? "bg-gray-500 text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setHistoryPage((prev) =>
                          Math.min(prev + 1, historyTotalPages)
                        )
                      }
                      disabled={historyPage === historyTotalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <IoCheckmark className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {successInfo.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{successInfo.message}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-5 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors w-full"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WithDraw;
