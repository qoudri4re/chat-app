import React from "react";
import { BsClockHistory } from "react-icons/bs";
import { TbCircleDashed } from "react-icons/tb";
import { GrGroup } from "react-icons/gr";
import { RiArchiveDrawerLine } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";

function SidebarHeader({
  setSearch,
  getAllUsers,
  search,
  showOrCloseSettings,
}) {
  function handleOnchange(e) {
    getAllUsers(e.target.value);
  }

  function handleOnBlur(e) {
    e.target.value = "";
  }
  function closeSearch(e) {
    e.target.value = "";
    setSearch(false);
  }

  return (
    <div className="header">
      <div className="top">
        <h2>LOREM</h2>
        <div className="right">
          <MdManageAccounts className="icon" onClick={showOrCloseSettings} />
        </div>
      </div>
      <div className="middle">
        <input
          type="text"
          placeholder="search"
          onClick={() => setSearch(true)}
          onBlur={handleOnBlur}
          name="searchTerm"
          onChange={handleOnchange}
        />
        {search && <span onClick={closeSearch}>close</span>}
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
