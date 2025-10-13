import React, { useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { IoCheckmark, IoClose, IoMenu } from "react-icons/io5";
import { SlBell } from "react-icons/sl";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { GoPackage } from "react-icons/go";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
const WithDraw = () => {
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
              <h1 className="font-medium text-xl">WithDrawal Approval </h1>
            </div>
            <div className="bg-gray-300 w-fit p-2 rounded-4xl">
              <SlBell size={20} />
            </div>
          </div>

          <div className="flex  flex-wrap gap-5 items-center">
            <div className="flex justify-between gap-3 mt-3 p-4  h-auto bg-purple-100 items-center rounded-2xl md:w-[23%] w-[100%] w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Total Revenue</h1>
                <h1 className="font-[600] text-purple-600 text-[20px]">
                  30,000
                </h1>
              </div>
              <div className="bg-purple-400 p-3 rounded-4xl">
                <GiMoneyStack size={20} />
              </div>
            </div>
          </div>
          <div className="mt-7">
            <h1>Pending Withdrawal</h1>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Initiator
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      20-10-2025
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Jhone doe
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">Rider</td>
                    <td className="px-6 py-4 text-sm text-gray-900">2,000</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="px-4 py-1 rounded-full bg-emerald-500 text-white font-small hover:bg-emerald-700">
                        Accept
                      </button>
                      <button className="px-4 py-1 rounded-full bg-red-600 text-white font-small hover:bg-red-700">
                        Reject
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-7">
            <h1>Transaction History </h1>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Initiator
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      20-10-2025
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Jhone doe
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">Rider</td>
                    <td className="px-6 py-4 text-sm text-gray-900">2,000</td>
                    <td className="px-6 py-4 flex gap-2">
                      <div className="text-green-500">Completed</div>
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

export default WithDraw;
