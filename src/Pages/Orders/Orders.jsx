import React, { useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { IoCheckmark, IoClose, IoMenu } from "react-icons/io5";
import { SlBell } from "react-icons/sl";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { GoPackage } from "react-icons/go";
import { MdOutlineContentPasteSearch } from "react-icons/md";
const Orders = () => {
  const [openNav, setOpenNav] = useState(false);
  return (
    <div className="flex w-full">
      {openNav && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpenNav(false)}
        />
      )}

      {/* Sidebar: slides in on mobile, always visible on md+ */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300
          ${openNav ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 w-[270px] md:w-[240px]
        `}
      >
        <SideBar setOpenNav={setOpenNav} />
      </div>

      <div className="flex-1 md:ml-[240px] w-full overflow-y-auto">
        <div className="md:p-4 px-5 mt-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-5 items-center">
              <div
                className="md:hidden flex bg-[#f6f6f6] rounded-[10px] p-2 cursor-pointer"
                onClick={() => setOpenNav(true)}
              >
                <IoMenu size={23} />
              </div>
              <h1 className="font-medium text-xl">University Order </h1>
            </div>
            <div className="bg-gray-300 w-fit p-2 rounded-4xl">
              <SlBell size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-light">select University</p>
            <select
              name=""
              id=""
              className="border-1 py-2 w-60 text-sm mt-1 outline-0 border-[#d3d3d3]"
            >
              <option value="">Crawford University</option>
              <option value="">Bowen University</option>
              <option value="">Bells University</option>
            </select>
          </div>
          <div className="flex  flex-wrap gap-5 items-center">
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-purple-100 items-center rounded-2xl md:w-[23%] w-[100%] w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Total Orders</h1>
                <h1 className="font-[600] text-purple-600 text-[20px]">300</h1>
                <div className="font-[13px] font-[400]">Orders</div>
              </div>
              <div className="bg-purple-400 p-3 rounded-4xl">
                <GoPackage size={20} />
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-green-100 items-center rounded-2xl md:w-[23%] w-[100%]  sm:w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Successful order</h1>
                <h1 className="font-[600] text-green-600 text-[20px]">100</h1>
                <div className="font-[13px] font-[400]">Orders</div>
              </div>
              <div className="bg-green-400 p-3 rounded-4xl">
                <IoCheckmark size={20} />
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-amber-100 items-center rounded-2xl md:w-[23%] w-[100%] w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Ongoing order</h1>
                <h1 className="font-[600] text-amber-600 text-[20px]">100</h1>
                <div className="font-[13px] font-[400]">Orders</div>
              </div>
              <div className="bg-amber-400 p-3 rounded-4xl">
                <MdOutlineContentPasteSearch size={20} />
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-red-100 items-center rounded-2xl md:w-[23%] w-[100%] w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Cancelled order</h1>
                <h1 className="font-[600] text-red-600 text-[20px]">100</h1>
                <div className="font-[13px] font-[400]">Orders</div>
              </div>
              <div className="bg-red-400 p-3 rounded-4xl">
                <IoClose size={20} />
              </div>
            </div>
          </div>
          <div className="mt-7">
            <h1>Delivery Request</h1>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Delivery Fee
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      #56973892
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">$50.00</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Crawford University
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="px-4 py-1 rounded-full bg-emerald-500 text-white font-small hover:bg-emerald-700">
                        Accept
                      </button>
                      <button className="px-4 py-1 rounded-full bg-red-600 text-white font-small hover:bg-red-700">
                        Decline
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-7">
            <h1 className="text-green-500">Completed Deliveries</h1>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Delivery Fee
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      #56973892
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">$50.00</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Crawford University
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <div className="text-green-500">completed</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-7">
            <h1 className="text-amber-400">Ongoing deliveries</h1>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Delivery Fee
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      #56973892
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">$50.00</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Crawford University
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <div className="text-amber-400">Pending</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-7">
            <h1 className="text-red-700">Declined Deliveries</h1>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Delivery Fee
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      #56973892
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">$50.00</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Crawford University
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <div className="text-red-700">Declined</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
