import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar/SideBar";
import { IoCheckmark, IoClose, IoMenu } from "react-icons/io5";
import { GoPackage } from "react-icons/go";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { useAppContext } from "../../components/AppContext";
import { CardsSkeleton, TableSkeleton } from "../../components/ui/Skeleton";
import "../Home/Home.css";

const defaultPageData = {
  counts: {
    total: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0,
  },
  allOrders: {
    items: [],
    total: 0,
    page: 1,
    totalPages: 0,
  },
  ongoingOrders: {
    items: [],
    total: 0,
    page: 1,
    totalPages: 0,
  },
  deliveredOrders: {
    items: [],
    total: 0,
    page: 1,
    totalPages: 0,
  },
};

const renderStatus = (status) => {
  if (status === "Pending") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        Pending
      </span>
    );
  }

  if (status === "Processing") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Processing
      </span>
    );
  }

  if (status === "Delivered") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Delivered
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
      Cancelled
    </span>
  );
};

const Pagination = ({
  page,
  totalPages,
  totalItems,
  itemsPerPage,
  onChange,
  activeClassName,
  label,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-2 sm:flex-row items-center justify-between mt-4 px-4">
      <p className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} {label}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>
        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onChange(index + 1)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                page === index + 1
                  ? activeClassName
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => onChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const OrdersTable = ({ title, accentClass, emptyIcon, emptyTitle, emptyText, rows, loading }) => (
  <div className="mt-7">
    <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
      <div className={`w-1 h-5 rounded-full ${accentClass}`} />
      {title}
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
            <th className="px-1 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Service Fee
            </th>
            <th className="px-1 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Delivery Fee
            </th>
            <th className="px-1 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {loading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : rows.length > 0 ? (
            rows.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #{item._id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item?.userId?.fullName || item?.userName || "Unknown User"}
                </td>
                <td className="px-6 py-4 text-sm">{renderStatus(item.currentStatus)}</td>
                <td className="px-6 py-4 text-sm text-blue-700">
                  ₦{(item.serviceFee || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-green-700">
                  ₦{(item.deliveryFee || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ₦
                  {(
                    (item.subtotal || 0) +
                    (item.serviceFee || 0) +
                    (item.deliveryFee || 0)
                  ).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  {emptyIcon}
                  <p className="text-gray-500 font-medium">{emptyTitle}</p>
                  <p className="text-sm text-gray-400">{emptyText}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const Orders = () => {
  const [openNav, setOpenNav] = useState(false);
  const { Universities, isLoading } = useAppContext();
  const [selected, setSelected] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ongoingPage, setOngoingPage] = useState(1);
  const [deliveredPage, setDeliveredPage] = useState(1);
  const [pageData, setPageData] = useState(defaultPageData);
  const [ordersPageLoading, setOrdersPageLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const itemsPerPage = 10;
  const pageLoading = isLoading || ordersPageLoading;

  useEffect(() => {
    let cancelled = false;

    const fetchPageData = async () => {
      setOrdersPageLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API}/api/users/orders/admin/page-data`,
          {
            params: {
              university: selected,
              date: selectedDate.toISOString().slice(0, 10),
              limit: itemsPerPage,
              allPage: currentPage,
              ongoingPage,
              deliveredPage,
            },
          }
        );

        if (!cancelled) {
          setPageData({
            ...defaultPageData,
            ...data,
          });
        }
      } catch (error) {
        console.error("Error fetching paginated admin orders:", error);
        if (!cancelled) {
          setPageData(defaultPageData);
        }
      } finally {
        if (!cancelled) {
          setOrdersPageLoading(false);
        }
      }
    };

    fetchPageData();

    return () => {
      cancelled = true;
    };
  }, [currentPage, deliveredPage, ongoingPage, selected, selectedDate]);

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
                  University Orders
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Track and monitor orders across all universities
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

          <div className="mb-5">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              Filter by University
            </label>
            <select
              name="universities"
              id="universities"
              className="border-2 border-gray-200 py-2.5 px-3 w-full md:w-80 text-sm rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all bg-white"
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                setCurrentPage(1);
                setOngoingPage(1);
                setDeliveredPage(1);
              }}
            >
              <option value="">All Universities</option>
              {Universities.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <label className="font-semibold text-gray-700">Select Date:</label>
            <input
              type="date"
              value={selectedDate.toISOString().slice(0, 10)}
              onChange={(e) => {
                const nextDate = new Date(e.target.value);
                nextDate.setHours(0, 0, 0, 0);
                setSelectedDate(nextDate);
                setCurrentPage(1);
                setOngoingPage(1);
                setDeliveredPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>

          {pageLoading ? (
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
                  <p className="text-2xl font-bold">{pageData.counts.total}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <IoCheckmark className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">Delivered</p>
                  </div>
                  <p className="text-2xl font-bold">{pageData.counts.delivered}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <MdOutlineContentPasteSearch className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">Ongoing</p>
                  </div>
                  <p className="text-2xl font-bold">{pageData.counts.pending}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <IoClose className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">Cancelled</p>
                  </div>
                  <p className="text-2xl font-bold">{pageData.counts.cancelled}</p>
                </div>
              </div>
            </div>
          )}

          <OrdersTable
            title="All Orders"
            accentClass="bg-blue-500"
            emptyIcon={<GoPackage size={36} className="text-gray-300" />}
            emptyTitle="No orders found"
            emptyText="Orders will appear here once customers place them"
            rows={pageData.allOrders.items}
            loading={pageLoading}
          />
          <Pagination
            page={currentPage}
            totalPages={pageData.allOrders.totalPages}
            totalItems={pageData.allOrders.total}
            itemsPerPage={itemsPerPage}
            onChange={setCurrentPage}
            activeClassName="bg-blue-500 text-white"
            label="orders"
          />

          <OrdersTable
            title="Ongoing Orders"
            accentClass="bg-amber-500"
            emptyIcon={<MdOutlineContentPasteSearch size={36} className="text-gray-300" />}
            emptyTitle="No ongoing orders"
            emptyText="Pending orders will appear here"
            rows={pageData.ongoingOrders.items}
            loading={pageLoading}
          />
          <Pagination
            page={ongoingPage}
            totalPages={pageData.ongoingOrders.totalPages}
            totalItems={pageData.ongoingOrders.total}
            itemsPerPage={itemsPerPage}
            onChange={setOngoingPage}
            activeClassName="bg-amber-500 text-white"
            label="ongoing orders"
          />

          <OrdersTable
            title="Delivered Orders"
            accentClass="bg-green-500"
            emptyIcon={<IoCheckmark size={36} className="text-gray-300" />}
            emptyTitle="No delivered orders"
            emptyText="Completed orders will appear here"
            rows={pageData.deliveredOrders.items}
            loading={pageLoading}
          />
          <Pagination
            page={deliveredPage}
            totalPages={pageData.deliveredOrders.totalPages}
            totalItems={pageData.deliveredOrders.total}
            itemsPerPage={itemsPerPage}
            onChange={setDeliveredPage}
            activeClassName="bg-green-500 text-white"
            label="delivered orders"
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;
