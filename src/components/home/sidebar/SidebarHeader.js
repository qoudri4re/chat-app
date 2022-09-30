import React from "react";
import { IoIosAddCircle } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsClockHistory } from "react-icons/bs";
import { TbCircleDashed } from "react-icons/tb";
import { GrGroup } from "react-icons/gr";
import { RiArchiveDrawerLine } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";
function SidebarHeader() {
  return (
    <div className="header">
      <div className="top">
        <h2>LOREM</h2>
        <div className="right">
          <IoIosAddCircle className="icon" />
          <HiOutlineDotsVertical className="icon" />
        </div>
      </div>
      <div className="middle">
        <input type="text" placeholder="search" />
      </div>
      <div className="bottom">
        <BsClockHistory className="icon active-icon" />
        <TbCircleDashed className="icon inactive-icon" />
        <GrGroup className="icon inactive-icon" />
        <RiArchiveDrawerLine className="icon inactive-icon" />
      </div>
    </div>
  );
}

export default SidebarHeader;
