import { useState, useEffect } from 'react';
import { productAPI } from '../../../../services/api';
import { Link, useNavigate } from 'react-router';
import { MdLogout, MdHistory, MdShoppingCart } from 'react-icons/md';
import { FaThreads } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser } from "react-icons/fa";
import logo from "../../../../assets/logo.png";
import gcash from "../../../../assets/gcash.png";
import paypal from "../../../../assets/paypal.png";
import visa from "../../../../assets/visa.png";
import maya from "../../../../assets/maya.png";
import homecredit from "../../../../assets/homecredit.png";
import mastercard from "../../../../assets/mastercard.png";
import usdt from "../../../../assets/usdt.png";
import ethereum from "../../../../assets/ethereum.png";
import xmr from "../../../../assets/xmr.png";
import btc from "../../../../assets/btc.png";

function gigabyte() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
    <nav className='w-full bg-black py-1 px-2 md:px-6 flex justify-end items-center stickys'>
        <button className="text-white border-2 border-white bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-sm font-medium rounded-sm shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 px-3 py-1 " onClick={() => navigate('/forum')}> FORUM</button>
      </nav>
      <nav className="w-full bg-orange-500 py-5 px-6 md:px-10 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <img src={logo} alt="Rigginie PH Logo" className="h-10 w-auto cursor-pointer" />
          </button>
        </div>
      </nav>
    </div>
  )
}

export default gigabyte