import { IoIosPeople } from "react-icons/io";
import { BsHouseFill } from "react-icons/bs";
import { MdDashboardCustomize } from "react-icons/md";
import {
  MdCalendarMonth,
  MdOutlineCalendarViewWeek,
  MdOutlineSchedule,
} from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import { MdOutlinePeople } from 'react-icons/md';

import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sidebar.css";
import logo from "./../../utils/Images/allen_logo.jpeg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    const storedActiveMenu = localStorage.getItem("activeMenu");
    if (storedActiveMenu) {
      setActiveMenu(storedActiveMenu);
    }
  }, []);

  const handleMenuClick = (link) => {
    setActiveMenu(link);
    localStorage.setItem("activeMenu", link);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://dev.allen-api.com:5020/api/logout");

      localStorage.removeItem("access_token");
      localStorage.removeItem("activeMenu");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const Menus = [
    

    { title: "Dashboard", icon: <MdDashboardCustomize />, link: "/" },
    { title: "Schedule", icon: <MdOutlineSchedule />, link: "/schedule" },
    { title: "Faculties", icon: <GiTeacher />, link: "/facultylist" },
    { title: "Batches", icon: <IoIosPeople />, link: "/batchlist" },
    // { title: "Reports", icon: <MdCalendarMonth />, link: "/reports" },
    {
      title: "Leaves",
      icon: <MdOutlineCalendarViewWeek />,
      link: "/LeaveList",
    },
    { title: " Users", icon: <MdOutlinePeople />, link: "/user" },

  ];

  return (
    <div className= "  bg-primaryColour fixed h-screen p-5 flex flex-col items-center font-serif" >
    <div className="flex items-center mb-8">
      <img src={logo} className="bg-slate-200 text-6xl rounded-full h-16 font-serif"  alt="Logo"></img>
    </div>
    <ul className="flex flex-col items-center  ">
      {Menus.map((menu, index) => (
        <NavLink
          to={menu.link}
          key={index}
          activeClassName="active tagHover font-serif"
          className="text-white text-lg flex items-center cursor-pointer mt-7 relative h-10 w-10 group hover:text-white focus:text-white"
          onClick={() => handleMenuClick(menu.link)}
        >
          <span className={`text-2xl ${activeMenu === menu.link ? "text-green-500" : ""}`}>
            {menu.icon}
          </span>
          <span className=" text-sm font-serif absolute bottom-[-60%] left-1/2 transform -translate-x-1/2 bg-green-400 text-white py-1 px-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {menu.title}
          </span>
        </NavLink>
      ))}

      <span className="text-white  flex items-center cursor-pointer mt-8 relative group hover:text-white focus:text-white">
        <div className="logout-icon-container">
          <FiLogOut
            className=""
            style={{ fontSize: "1.6vw" }}
            onClick={handleLogout}
          />
          <span className="title-text text-sm bg-green-400 font-serif ">Logout</span>
        </div>
      </span>
    </ul>
  </div>

    // <div
    //   className="bg-primaryColour fixed h-screen  p-5 flex flex-col items-center font-serif"
    //   style={{ width: "9vw" }}
    // >
    //   <div className="flex items-center mb-8">
    //     <img
    //       src={logo}
    //       className="bg-slate-200 text-6xl rounded-full h-20"
    //     ></img>
    //   </div>
    //   <ul className="flex flex-col items-center mt-5 p-5">
    //     {Menus.map((menu, index) => (
    //       <NavLink
    //         to={menu.link}
    //         key={index}
    //         activeClassName="active tagHover"
    //         className="text-white  text-lg flex items-center cursor-pointer mt-6 relative h-10 w-10 group hover:text-white focus:text-white "
    //         onClick={() => handleMenuClick(menu.link)}
    //       >
    //         <span
    //           className={`text-3xl ${
    //             activeMenu === menu.link ? "text-green-500" : ""
    //           }`}
    //         >
    //           {menu.icon}
    //         </span>
    //         <span className="absolute bottom-[-90%] left-1/2 transform -translate-x-1/2 bg-green-400  text-white py-1 px-2  opacity-0 transition-opacity duration-200 group-hover:opacity-100">
    //           {menu.title}
    //         </span>
    //       </NavLink>
    //     ))}

    //     <span className="text-white text-lg flex  items-center cursor-pointer mt-6 relative group hover:text-white focus:text-white">
    //       <div className="logout-icon-container  ">
    //         <FiLogOut
    //           className=""
    //           style={{ fontSize: "32px" }}
    //           onClick={handleLogout}
    //         />
    //         <span className="title-text   bg-green-400">Logout</span>
    //       </div>
    //     </span>
    //   </ul>
    // </div>
  );
};

export default Sidebar;
