import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { IoMenu } from "react-icons/io5";
import { SlBell } from "react-icons/sl";
import { MdClose, MdStorefront, MdDelete } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import "../Home/Home.css";

const Vendors = () => {
  const [openNav, setOpenNav] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState({});
  const [deleting, setDeleting] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, vendor: null });

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API}/api/vendors/all`
      );
      setVendors(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API}/api/universities/`
      );
      setUniversities(data.universities || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load universities");
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchUniversities();
  }, []);

  const handleToggleActive = async (vendorId, currentStatus) => {
    setToggling((prev) => ({ ...prev, [vendorId]: true }));
    try {
      const newStatus = currentStatus === "true" ? "false" : "true";
      const endpoint =
        newStatus === "true"
          ? `${
              import.meta.env.VITE_REACT_APP_API
            }/api/vendors/${vendorId}/activate`
          : `${
              import.meta.env.VITE_REACT_APP_API
            }/api/vendors/${vendorId}/deactivate`;

      await axios.patch(endpoint);
      toast.success(
        `Vendor ${
          newStatus === "true" ? "activated" : "deactivated"
        } successfully`
      );
      fetchVendors();
    } catch (err) {
      toast.error("Failed to update vendor status");
    } finally {
      setToggling((prev) => ({ ...prev, [vendorId]: false }));
    }
  };

  const handleDeleteVendor = async () => {
    if (!deleteModal.vendor) return;
    const vendorId = deleteModal.vendor._id;
    setDeleting((prev) => ({ ...prev, [vendorId]: true }));
    try {
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API}/api/vendors/${vendorId}`
      );
      toast.success("Vendor deleted successfully");
      setDeleteModal({ open: false, vendor: null });
      fetchVendors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete vendor");
    } finally {
      setDeleting((prev) => ({ ...prev, [vendorId]: false }));
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.university?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUniversity = selectedUniversity
      ? v.university === selectedUniversity
      : true;

    return matchesSearch && matchesUniversity;
  });

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
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
                  Vendor Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage all vendors and their activation status
                </p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 w-fit p-3 rounded-xl shadow-sm">
              <SlBell size={14} className="text-gray-600" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          {/* University Filter */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <label className="text-sm font-semibold text-gray-700 min-w-fit">
                Filter by University:
              </label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full md:w-80 border-2 border-gray-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all bg-white cursor-pointer"
              >
                <option value="">All Universities</option>
                {universities.map((uni) => (
                  <option key={uni._id} value={uni.name}>
                    {uni.name}
                  </option>
                ))}
              </select>
              {selectedUniversity && (
                <button
                  onClick={() => setSelectedUniversity("")}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-all"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vendors.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <MdStorefront className="text-white" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Active Vendors</p>
                  <p className="text-2xl font-bold text-green-600">
                    {vendors.filter((v) => v.Active === "true").length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white text-2xl">✓</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Inactive Vendors</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {vendors.filter((v) => v.Active === "false").length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <span className="text-white text-2xl">✕</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vendors Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      University
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    <>
                      {[1, 2, 3, 4].map((i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="h-8 w-52 bg-gradient-to-r from-gray-100 to-gray-50 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-32 bg-gradient-to-r from-gray-100 to-gray-50 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-40 bg-gradient-to-r from-gray-100 to-gray-50 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-20 bg-gradient-to-r from-gray-100 to-gray-50 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-6 w-24 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-8 w-32 bg-gradient-to-r from-gray-100 to-gray-50 rounded animate-pulse" />
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor) => (
                      <tr
                        key={vendor._id}
                        className="hover:bg-purple-50/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                vendor.image || "https://via.placeholder.com/40"
                              }
                              alt={vendor.storeName}
                              className="w-10 h-10 rounded-lg object-cover shadow-sm"
                            />
                            <div>
                              <p className="font-semibold text-sm text-gray-900">
                                {vendor.storeName}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {vendor._id.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {vendor.university}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {vendor.email}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ₦{(vendor.availableBal || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              !toggling[vendor._id] &&
                              handleToggleActive(vendor._id, vendor.Active)
                            }
                            disabled={!!toggling[vendor._id]}
                            aria-pressed={vendor.Active === "true"}
                            className={`group relative inline-flex items-center gap-2 px-2 py-1 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${
                              vendor.Active === "true"
                                ? "bg-gradient-to-r from-green-600 to-emerald-600 border-green-700 shadow-sm"
                                : "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-600 shadow-sm"
                            } ${
                              toggling[vendor._id]
                                ? "opacity-70 cursor-wait"
                                : "cursor-pointer"
                            }`}
                          >
                            <span className="relative h-5 w-10 flex items-center">
                              <span
                                className={`absolute inset-0 rounded-full ${
                                  vendor.Active === "true"
                                    ? "bg-white/20"
                                    : "bg-black/20"
                                }`}
                              />
                              <span
                                className={`relative h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
                                  vendor.Active === "true"
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              >
                                {toggling[vendor._id] && (
                                  <svg
                                    className="animate-spin h-3 w-3 text-gray-500 absolute inset-0 m-auto"
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
                                )}
                              </span>
                            </span>
                            <span className="text-[10px] font-semibold text-white tracking-wide">
                              {toggling[vendor._id]
                                ? "Saving..."
                                : vendor.Active === "true"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              setDeleteModal({ open: true, vendor })
                            }
                            className="px-3 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs font-medium hover:from-rose-600 hover:to-red-700 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
                          >
                            <MdDelete size={14} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-16">
                        <div className="text-center bg-white rounded-xl border border-gray-100 py-10">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mb-3">
                            <MdStorefront className="w-8 h-8 text-purple-500" />
                          </div>
                          <p className="text-gray-600 font-medium">
                            No vendors found
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Try adjusting your search criteria
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

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative bg-white rounded-2xl p-6 w-[90%] md:w-[480px] shadow-2xl animate-slideUp">
            <button
              onClick={() => setDeleteModal({ open: false, vendor: null })}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <MdClose
                size={18}
                className="text-gray-500 group-hover:text-gray-700"
              />
            </button>

            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MdDelete className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Delete Vendor?
              </h2>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {deleteModal.vendor?.storeName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteModal({ open: false, vendor: null })}
                className="flex-1 border-2 border-gray-200 rounded-xl px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVendor}
                disabled={deleting[deleteModal.vendor?._id]}
                className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl px-6 py-3 text-sm font-semibold hover:from-rose-600 hover:to-red-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {deleting[deleteModal.vendor?._id] ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
