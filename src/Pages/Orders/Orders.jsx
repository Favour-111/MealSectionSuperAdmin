import React, { useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { IoCheckmark, IoClose, IoMenu } from "react-icons/io5";
import { SlBell } from "react-icons/sl";
import { GoPackage } from "react-icons/go";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { useAppContext } from "../../components/AppContext";
import { CardsSkeleton, TableSkeleton } from "../../components/ui/Skeleton";
import "../Home/Home.css";

const Orders = () => {
  const [openNav, setOpenNav] = useState(false);
  const { Universities, allUsers, allOrder, isLoading } = useAppContext();
  const [selected, setSelected] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ongoingPage, setOngoingPage] = useState(1);
  const [deliveredPage, setDeliveredPage] = useState(1);
  const itemsPerPage = 10;

  // 🧠 Filter orders by selected university and reverse to show newest first
  const filteredOrders = selected
    ? [...allOrder].filter((order) => order.university === selected).reverse()
    : [...allOrder].reverse();

  // Derived stats (based on the filtered list)
  const success = filteredOrders.filter(
    (item) => item.currentStatus === "Delivered"
  );
  const pending = filteredOrders.filter(
    (item) => item.currentStatus === "Pending"
  );
  const cancelled = filteredOrders.filter(
    (item) => item.currentStatus === "Cancelled"
  );

  // Pagination logic for all orders
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination for ongoing orders
  const ongoingOrders = filteredOrders.filter(
    (item) => item.currentStatus === "Pending"
  );
  const ongoingTotalPages = Math.ceil(ongoingOrders.length / itemsPerPage);
  const paginatedOngoing = ongoingOrders.slice(
    (ongoingPage - 1) * itemsPerPage,
    ongoingPage * itemsPerPage
  );

  // Pagination for delivered orders
  const deliveredOrders = filteredOrders.filter(
    (item) => item.currentStatus === "Delivered"
  );
  const deliveredTotalPages = Math.ceil(deliveredOrders.length / itemsPerPage);
  const paginatedDelivered = deliveredOrders.slice(
    (deliveredPage - 1) * itemsPerPage,
    deliveredPage * itemsPerPage
  );

  console.log(allUsers);

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Mobile overlay */}
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
                  University Orders
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Track and monitor orders across all universities
                </p>
              </div>
            </div>
            <button className="bg-white/80 backdrop-blur-sm border border-gray-200 w-fit p-3 rounded-xl hover:bg-white transition-all shadow-sm group">
              <SlBell
                size={16}
                className="text-gray-600 group-hover:text-purple-500 transition-colors"
              />
            </button>
          </div>

          {/* Filter */}
          <div className="mb-5">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              Filter by University
            </label>
            <select
              name="universities"
              id="universities"
              className="border-2 border-gray-200 py-2.5 px-3 w-full md:w-80 text-sm rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all bg-white"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">All Universities</option>
              {Universities.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Summary Cards */}
          {isLoading ? (
            <CardsSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <GoPackage className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">Total</p>
                  </div>
                  <p className="text-2xl font-bold">{filteredOrders.length}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <IoCheckmark className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">
                      Delivered
                    </p>
                  </div>
                  <p className="text-2xl font-bold">{success.length}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <MdOutlineContentPasteSearch
                      className="text-white/90"
                      size={18}
                    />
                    <p className="text-xs font-medium text-white/90">Ongoing</p>
                  </div>
                  <p className="text-2xl font-bold">{pending.length}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <IoClose className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">
                      Cancelled
                    </p>
                  </div>
                  <p className="text-2xl font-bold">{cancelled.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div className="mt-7">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-blue-500 rounded-full" />
              All Orders
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {isLoading ? (
                    <TableSkeleton rows={5} cols={5} />
                  ) : paginatedOrders.length > 0 ? (
                    paginatedOrders.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          #{item._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {allUsers?.find((itm) => itm?._id === item.userId)
                            ?.fullName || "Unknown User"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {item.currentStatus === "Pending" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              Pending
                            </span>
                          ) : item.currentStatus === "Delivering" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Delivering
                            </span>
                          ) : item.currentStatus === "Delivered" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Delivered
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Cancelled
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ₦
                          {(
                            item.subtotal +
                            item.serviceFee +
                            item.deliveryFee
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <GoPackage size={36} className="text-gray-300" />
                          <p className="text-gray-500 font-medium">
                            No orders found
                          </p>
                          <p className="text-sm text-gray-400">
                            Orders will appear here once customers place them
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-7">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-amber-500 rounded-full" />
              Ongoing Orders
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {isLoading ? (
                    <TableSkeleton rows={4} cols={5} />
                  ) : paginatedOngoing.length > 0 ? (
                    paginatedOngoing.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          #{item._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {allUsers?.find((itm) => itm?._id === item.userId)
                            ?.fullName || "Unknown User"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ₦
                          {(
                            item.subtotal +
                            item.serviceFee +
                            item.deliveryFee
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <MdOutlineContentPasteSearch
                            size={36}
                            className="text-gray-300"
                          />
                          <p className="text-gray-500 font-medium">
                            No ongoing orders
                          </p>
                          <p className="text-sm text-gray-400">
                            Pending orders will appear here
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination for Ongoing Orders */}
            {ongoingTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-4">
                <p className="text-sm text-gray-600">
                  Showing {(ongoingPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(ongoingPage * itemsPerPage, ongoingOrders.length)}{" "}
                  of {ongoingOrders.length} ongoing orders
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setOngoingPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={ongoingPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {[...Array(ongoingTotalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setOngoingPage(i + 1)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          ongoingPage === i + 1
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
                      setOngoingPage((prev) =>
                        Math.min(prev + 1, ongoingTotalPages)
                      )
                    }
                    disabled={ongoingPage === ongoingTotalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="mt-7">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-green-500 rounded-full" />
              Delivered Orders
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {isLoading ? (
                    <TableSkeleton rows={4} cols={5} />
                  ) : paginatedDelivered.length > 0 ? (
                    paginatedDelivered.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          #{item._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {allUsers?.find((itm) => itm?._id === item.userId)
                            ?.fullName || "Unknown User"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Delivered
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ₦
                          {(
                            item.subtotal +
                            item.serviceFee +
                            item.deliveryFee
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <IoCheckmark size={36} className="text-gray-300" />
                          <p className="text-gray-500 font-medium">
                            No delivered orders
                          </p>
                          <p className="text-sm text-gray-400">
                            Completed orders will appear here
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination for Delivered Orders */}
            {deliveredTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-4">
                <p className="text-sm text-gray-600">
                  Showing {(deliveredPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    deliveredPage * itemsPerPage,
                    deliveredOrders.length
                  )}{" "}
                  of {deliveredOrders.length} delivered orders
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setDeliveredPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={deliveredPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {[...Array(deliveredTotalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setDeliveredPage(i + 1)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          deliveredPage === i + 1
                            ? "bg-green-500 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setDeliveredPage((prev) =>
                        Math.min(prev + 1, deliveredTotalPages)
                      )
                    }
                    disabled={deliveredPage === deliveredTotalPages}
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
  );
};

export default Orders;
