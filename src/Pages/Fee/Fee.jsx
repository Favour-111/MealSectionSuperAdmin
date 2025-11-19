import React, { useState, useEffect, useMemo } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { IoMenu, IoCheckmark } from "react-icons/io5";
import { SlBell } from "react-icons/sl";
import { MdAttachMoney, MdStore } from "react-icons/md";
import { FiSettings, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../../components/AppContext";
import { CardsSkeleton, TableSkeleton } from "../../components/ui/Skeleton";
import "../Home/Home.css";

const Fee = () => {
  const [openNav, setOpenNav] = useState(false);
  const { Universities } = useAppContext();
  const [vendors, setVendors] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [fees, setFees] = useState([]);
  const [feesLoading, setFeesLoading] = useState(true);
  const [loading, setLoading] = useState(false); // for main fetches (add/delete)
  const [vendorLoading, setVendorLoading] = useState(false); // for fetching vendors
  const [deleteLoading, setDeleteLoading] = useState(""); // for specific delete button

  const API = import.meta.env.VITE_REACT_APP_API;

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalVendors = fees.length;

    const avgMinFee =
      fees.length > 0
        ? fees.reduce((sum, f) => sum + (f.minimumDeliveryFee || 0), 0) /
          fees.length
        : 0;
    const avgMaxFee =
      fees.length > 0
        ? fees.reduce((sum, f) => sum + (f.maximumDeliveryFee || 0), 0) /
          fees.length
        : 0;

    return {
      totalVendors,
      avgMinFee: Math.round(avgMinFee),
      avgMaxFee: Math.round(avgMaxFee),
    };
  }, [fees]);

  // ✅ Fetch all delivery fees
  const fetchFees = async () => {
    setFeesLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/delivery`);
      setFees(data);
    } catch (err) {
      toast.error("Error fetching delivery fees");
    } finally {
      setFeesLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  // ✅ Fetch vendors for selected university
  const fetchVendors = async (university) => {
    setVendorLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/vendors/all`);
      // You can filter vendors by university if API returns all
      const filtered = data.filter(
        (v) => v.university?.toLowerCase() === university.toLowerCase()
      );
      setVendors(filtered);
    } catch (err) {
      toast.error("Error fetching vendors");
    } finally {
      setVendorLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUniversity) fetchVendors(selectedUniversity);
  }, [selectedUniversity]);

  // ✅ Handle Add Fee
  const handleAddFee = async () => {
    if (!selectedVendor || !minFee || !maxFee)
      return toast.error("Please fill in all fields");

    setLoading(true);
    try {
      await axios.post(`${API}/api/delivery/add`, {
        vendorId: selectedVendor,
        minimumDeliveryFee: minFee,
        maximumDeliveryFee: maxFee,
      });

      toast.success("Fee added successfully");
      setMinFee("");
      setMaxFee("");
      setSelectedVendor("");
      fetchFees();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding fee");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Delete Fee
  const handleDelete = async (vendorId) => {
    if (!window.confirm("Delete this fee?")) return;
    setDeleteLoading(vendorId);
    try {
      await axios.delete(`${API}/api/delivery/${vendorId}`);
      toast.success("Fee deleted");
      fetchFees();
    } catch (err) {
      toast.error("Error deleting fee");
    } finally {
      setDeleteLoading("");
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Overlay for mobile sidebar */}
      {openNav && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpenNav(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300
          ${openNav ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 w-[270px] md:w-[240px]`}
      >
        <SideBar setOpenNav={setOpenNav} />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-[240px] w-full overflow-y-auto">
        <div className="md:p-6 px-5 mt-3 pb-10">
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
                  Fee Management
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Configure service and delivery fees for vendors
                </p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          {feesLoading ? (
            <CardsSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <MdStore className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">
                      Total Vendors
                    </p>
                  </div>
                  <p className="text-2xl font-bold">
                    {summaryStats.totalVendors}
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <MdAttachMoney className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">
                      Avg Min Fee
                    </p>
                  </div>
                  <p className="text-2xl font-bold">
                    ₦{summaryStats.avgMinFee}
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <MdAttachMoney className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">
                      Avg Max Fee
                    </p>
                  </div>
                  <p className="text-2xl font-bold">
                    ₦{summaryStats.avgMaxFee}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-5">
              <div className="w-1 h-5 bg-indigo-500 rounded-full" />
              Add New Fee Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  Select University
                </label>
                <select
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="border-2 border-gray-200 w-full rounded-xl py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white"
                >
                  <option value="">Select a University</option>
                  {Universities.map((u) => (
                    <option key={u._id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  Select Vendor
                </label>
                {vendorLoading ? (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-gray-500">Loading vendors...</p>
                  </div>
                ) : (
                  <select
                    onChange={(e) => setSelectedVendor(e.target.value)}
                    className="border-2 border-gray-200 w-full rounded-xl py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={!selectedUniversity}
                  >
                    <option value="">
                      {selectedUniversity
                        ? "Select a Vendor"
                        : "Select a University first"}
                    </option>
                    {vendors.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.storeName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  Minimum Delivery Fee
                </label>
                <input
                  type="number"
                  value={minFee}
                  onChange={(e) => setMinFee(e.target.value)}
                  placeholder="Enter minimum delivery fee"
                  className="border-2 border-gray-200 w-full rounded-xl py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  Maximum Delivery Fee
                </label>
                <input
                  type="number"
                  value={maxFee}
                  onChange={(e) => setMaxFee(e.target.value)}
                  placeholder="Enter maximum delivery fee"
                  className="border-2 border-gray-200 w-full rounded-xl py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAddFee}
                  disabled={loading}
                  className="text-sm text-white font-medium py-2.5 px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 w-full rounded-xl flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <IoCheckmark size={18} />
                      Save Configuration
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-7">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-gray-500 rounded-full" />
              Fee Configurations
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      University
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Min Fee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Max Fee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {feesLoading ? (
                    <TableSkeleton rows={5} cols={6} />
                  ) : fees.length > 0 ? (
                    fees.map((f) => (
                      <tr
                        key={f._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {f.vendorId?.storeName || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {f.vendorId?.university || "N/A"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          ₦{f.minimumDeliveryFee}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          ₦{f.maximumDeliveryFee}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(f.vendorId?._id)}
                            disabled={deleteLoading === f.vendorId?._id}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleteLoading === f.vendorId?._id ? (
                              <>
                                <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <FiTrash2 size={14} />
                                Delete
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <FiSettings size={36} className="text-gray-300" />
                          <p className="text-gray-500 font-medium">
                            No fee configurations yet
                          </p>
                          <p className="text-sm text-gray-400">
                            Add your first fee configuration using the form
                            above
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

export default Fee;
