import React, { useState } from "react";
import { GrAppsRounded } from "react-icons/gr";
import { LuNewspaper } from "react-icons/lu";
import { GrHistory } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { BsBank } from "react-icons/bs";
import { IoGiftOutline, IoWalletOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
const SideBar = ({ setOpenNav }) => {
  const pathToItem = {
    "/home": "home",
    "/order": "order",
    "/fee": "fee",
    "/universities": "universities",
    "/withdraw": "withdraw",
    "/promotion": "promotion",
  };
  const selectedItem = pathToItem[location.pathname] || "home";
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-white shadow-2xl w-full overflow-y-auto">
      <div className="flex items-center justify-between p-3">
        <img
          src="https://favour-111.github.io/MEalSection-ComongSoon-2.0/WhatsApp%20Image%202024-08-24%20at%2020.18.12_988ce6f9.jpg"
          alt="logo"
          className="w-[150px]"
        />

        {/* Close only visible on mobile */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpenNav?.(false)}
          aria-label="Close sidebar"
        >
          <AiOutlineClose size={20} />
        </button>
      </div>

      <div className="mt-3">
        <div
          onClick={() => {
            navigate("/home");
          }}
          className={`flex items-center gap-2 h-10 cursor-pointer w-full p-3 ${
            selectedItem === "home"
              ? "bg-[var(--defaultLight)] border-r-4 border-[var(--default)]"
              : "bg-transparent"
          } `}
        >
          <GrAppsRounded />
          <div className="text-[13px]">OverView</div>
        </div>

        <div
          onClick={() => {
            navigate("/order");
            setSelectedItem("order");
          }}
          className={`flex items-center gap-2 h-10 cursor-pointer w-full p-3 ${
            selectedItem === "order"
              ? "bg-[var(--defaultLight)] border-r-4 border-[var(--default)]"
              : "bg-transparent"
          } `}
        >
          <LuNewspaper />
          <div className="text-[13px]">Order</div>
        </div>

        <div
          onClick={() => {
            navigate("/universities");
          }}
          className={`flex items-center gap-2 h-10 cursor-pointer w-full p-3 ${
            selectedItem === "universities"
              ? "bg-[var(--defaultLight)] border-r-4 border-[var(--default)]"
              : "bg-transparent"
          } `}
        >
          <BsBank />
          <div className="text-[13px]">Universities</div>
        </div>
        <div
          onClick={() => {
            navigate("/withdraw");
          }}
          className={`flex items-center gap-2 h-10 cursor-pointer w-full p-3 ${
            selectedItem === "withdraw"
              ? "bg-[var(--defaultLight)] border-r-4 border-[var(--default)]"
              : "bg-transparent"
          } `}
        >
          <IoWalletOutline />
          <div className="text-[13px]">Withdraw</div>
        </div>
        <div
          onClick={() => {
            navigate("/promotion");
          }}
          className={`flex items-center gap-2 h-10 cursor-pointer w-full p-3 ${
            selectedItem === "promotion"
              ? "bg-[var(--defaultLight)] border-r-4 border-[var(--default)]"
              : "bg-transparent"
          } `}
        >
          <IoGiftOutline />
          <div className="text-[13px]">Promotion</div>
        </div>
        <div
          onClick={() => {
            navigate("/fee");
          }}
          className={`flex items-center gap-2 h-10 cursor-pointer w-full p-3 ${
            selectedItem === "fee"
              ? "bg-[var(--defaultLight)] border-r-4 border-[var(--default)]"
              : "bg-transparent"
          } `}
        >
          <FiSettings />
          <div className="text-[13px]">Fee settings</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
