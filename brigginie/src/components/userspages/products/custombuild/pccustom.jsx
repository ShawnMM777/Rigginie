import { useState, useEffect } from 'react';
import { Link, useNavigation } from 'react-router'
import { cartAPI , getUser, productAPI } from '../../../../services/api';
import gcash from '../../../../assets/gcash.png';
import paypal from '../../../../assets/paypal.png';
import visa from '../../../../assets/visa.png';
import maya from '../../../../assets/maya.png';
import homecredit from '../../../../assets/homecredit.png';
import mastercard from '../../../../assets/mastercard.png';
import usdt from '../../../../assets/usdt.png';
import ethereum from '../../../../assets/ethereum.png';
import xmr from '../../../../assets/xmr.png';
import btc from '../../../../assets/btc.png';
import nvidia from '../../../../assets/nvidia.png';
import amd from '../../../../assets/amdseries.png';
import { FaThreads } from 'react-icons/fa6';
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaDiscord, FaTwitch, FaUser } from 'react-icons/fa';
import { TbMapPinFilled } from 'react-icons/tb';
import { MdLogout, MdHistory, MdShoppingCart } from 'react-icons/md';

const pccustom = () => {
  return (
    <div className='min-h-screen bg-gray-50  flex-col'>
      <nav className='w-full bg-black py-1 px-2 flex justify-end item'> 
        <button className="text-white border-2 border-white bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-sm px-3 py-1 transition" onClick={() => navigate('/forum')}>FORUM</button>
        <a onClick={() => navigate('/help')} className="font-medium hover:underline text-amber-100 cursor-pointer">Help & Support</a>
        <a onClick={() => navigate('/blog')} className="font-medium hover:underline text-amber-100 cursor-pointer">Blog</a>
        <a onClick={() => navigate('/survey')} className="font-medium hover:underline text-amber-100 cursor-pointer">Survey</a>
      </nav>
    </div>
  )
}

export default pccustom
