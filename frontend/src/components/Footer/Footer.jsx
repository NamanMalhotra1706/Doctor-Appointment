import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assests/images/logo.png";
import { RiLinkedinFill } from "react-icons/ri";
import {
  AiFillYoutube,
  AiFillGithub,
  AiOutlineInstagram,
} from "react-icons/ai";
const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="container text-center items-center flex justify-center">
        <div className="flex justify-between flex-col md:flex-row flex-wrap gap-[30px] items-center">
          <div className="flex items-center justify-center">
            <img src={logo} className=" text-center" alt="" />
            <p className="text-[16px] leading-7 font-[400] text-textColor mt-4">
              Copyright {year} developed by Coders group all right reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
