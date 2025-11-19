import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Orders from "./Pages/Orders/Orders";
import Universities from "./Pages/Universities/Universities";
import WithDraw from "./Pages/WithDraw/WithDraw";
import Promotion from "./Pages/Promotion/Promotion";
import Fee from "./Pages/Fee/Fee";
import Vendors from "./Pages/Vendors/Vendors";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/order" element={<Orders />} />
        <Route path="/fee" element={<Fee />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/Withdraw" element={<WithDraw />} />
        <Route path="/promotion" element={<Promotion />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
