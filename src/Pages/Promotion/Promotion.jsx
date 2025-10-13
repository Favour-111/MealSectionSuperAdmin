import React, { useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { IoCheckmark, IoClose, IoMenu } from "react-icons/io5";
import { SlBell } from "react-icons/sl";
import { FaRegEdit, FaRegMoneyBillAlt } from "react-icons/fa";
import { GoPackage } from "react-icons/go";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
const Promotion = () => {
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
              <h1 className="font-medium text-xl">Promotions </h1>
            </div>
            <div className="bg-gray-300 w-fit p-2 rounded-4xl">
              <SlBell size={20} />
            </div>
          </div>

          <div className="mt-7">
            <h1 className="text-amber-400">Ongoing Campaigns</h1>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">C101</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Elegance
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">10%</td>
                    <td className="px-6 py-4 text-sm text-gray-900">1 Week</td>
                    <td className="px-6 py-4 text-sm text-amber-500">Active</td>

                    <td className="px-6 py-4 flex gap-2">
                      <div className="text-green-600">
                        <FaRegEdit />
                      </div>
                      <div className="text-red-500">
                        <FiTrash2 />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-7">
            <h1 className="font-bold">Featured Vendors</h1>
            <div className="flex item-center gap-4 flex-wrap mt-4">
              <div className="w-30 bg-[#D9D9D94D] p-2 rounded text-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt=""
                />
                <p className="text-sm font-medium mt-1">Elegance</p>
              </div>
            </div>
          </div>
          <div className="mt-7">
            <h1 className="text-green-500">Completed Campaigns</h1>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">C101</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Elegance
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">10%</td>
                    <td className="px-6 py-4 text-sm text-gray-900">1 Week</td>
                    <td className="px-6 py-4 text-sm text-green-500">
                      Completed
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

export default Promotion;
