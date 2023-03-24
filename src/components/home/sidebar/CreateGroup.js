import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import defaultGroupIcon from "../icons/icons8-user-groups-64.png";
import { BiCamera } from "react-icons/bi";
//import { AiOutlineCloudUpload } from "react-icons/ai";
import PotentialGroupMember from "./PotentialGroupMember";
import EmptySearch from "../../empty/EmptySearch";
import ErrorModal from "./ErrorModal";
import { client, requestHeaderConfig } from "../../../utils/axios-request";

function CreateGroup({
  showOrCloseCreateGroup,
  friendsDetails,
  getAllUsers,
  searchResults,
  userDetails,
  setUserDetails,
  switchBetweenStatusChatListGroup,
}) {
  const [search, setSearch] = useState(false);
  const [friends, setFriends] = useState(
    friendsDetails.map((item) => {
      return { ...item, added: false };
    })
  );

  const [searchedFriends, setSearchFriends] = useState(null);
  const [filterFriends, setFilterFriends] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [errors, setErrors] = useState([]);

  const inputRef = useRef(null);

  function handleGroupNameOnchange(e) {
    setGroupName(e.target.value);
  }
  function closeErrorModal() {
    setErrors([]);
  }
  function closeSearchAndClearInput() {
    setSearch(false);
    inputRef.current.value = "";
  }

  function createGroup() {
    if (groupName === "") {
      setErrors((prevVal) => [...prevVal, "Enter group's name"]);
    }
    const selectedUsers = friends.filter((item) => item.added === true);
    if (selectedUsers.length) {
      const selectedUsersId = selectedUsers.map((item) => item._id);
      selectedUsersId.push(userDetails.userID);
      client
        .post(
          "/createGroup",
          {
            groupName,
            participantsId: selectedUsersId,
            adminId: userDetails.userID,
          },
          requestHeaderConfig(userDetails.token)
        )
        .then((res) => {
          if ("tokenError" in res.data) {
            setUserDetails(null);
          } else if ("serverError" in res.data) {
            setErrors([...errors, res.data.serverError]);
          } else {
            switchBetweenStatusChatListGroup("groups");
            showOrCloseCreateGroup();
          }
        })
        .catch((err) => console.log(err));
    } else {
      setErrors((prevVal) => [
        ...prevVal,
        "You must add at least a user to the group",
      ]);
    }
  }

  useEffect(() => {
    let timeoutId;
    if (errors.length) {
      timeoutId = setTimeout(() => {
        setErrors([]);
      }, 4000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errors]);

  useEffect(() => {
    if (searchResults) {
      setSearchFriends(
        searchResults
          ? searchResults.map((item) => {
              return { ...item, added: false };
            })
          : null
      );
    } else {
      setSearchFriends(null);
    }
  }, [searchResults]);

  function handleOnchange(e) {
    getAllUsers(e.target.value, "group");
  }

  useEffect(() => {
    const searchResultRemoved = friends.some(
      (item) => item.searchResult && !item.added
    );

    if (searchResultRemoved && filterFriends) {
      setFriends(
        friends.filter(
          (item) => !item.searchResult || (item.searchResult && item.added)
        )
      );
    }
    setFilterFriends(false);
  }, [friends, filterFriends]);

  function addMember(id) {
    const isAlreadyExist = friends.some((item) => item._id === id);
    if (isAlreadyExist) {
      setFriends(
        friends.map((item) => {
          if (item._id === id) {
            setFilterFriends(true);
            return { ...item, added: !item.added };
          }
          return item;
        })
      );
      if (searchedFriends) {
        const existInSearchedFriends = searchedFriends.some(
          (item) => item._id === id
        );

        if (existInSearchedFriends) {
          setSearchFriends(
            searchedFriends.map((item) => {
              if (item._id === id) {
                return { ...item, added: !item.added };
              }
              return item;
            })
          );
        }
      }
    } else {
      const existInSearchedFriends = searchedFriends.some(
        (item) => item._id === id
      );
      if (existInSearchedFriends) {
        const user = searchedFriends.filter((item) => item._id === id)[0];
        if (!user.added) {
          setFriends([
            ...friends,
            { ...user, added: !user.added, searchResult: true },
          ]);
          setFilterFriends(true);
        }
        setSearchFriends(
          searchedFriends.map((item) => {
            if (item._id === id) {
              return { ...item, added: !item.added };
            }
            return item;
          })
        );
      }
    }
  }

  return (
    <div className="create__group">
      {errors.length ? (
        <ErrorModal errors={errors} closeErrorModal={closeErrorModal} />
      ) : (
        ""
      )}
      <div className="create__group__header">
        <div className="header__text">
          <h3>Create a group</h3>
        </div>
        <div className="close__icon">
          <AiOutlineClose onClick={showOrCloseCreateGroup} className="icon" />
        </div>
      </div>
      <div className="group__details">
        <div className="add__image__icon">
          <img src={defaultGroupIcon} alt="" />
          <BiCamera className="overlay__icon" />
        </div>
        <div className="group__name">
          <input
            type="text"
            placeholder="Name your group"
            value={groupName}
            onChange={handleGroupNameOnchange}
          />
        </div>
      </div>
      <div className="add__members">
        <div className="search searching">
          <input
            type="text"
            placeholder="Search for a member to add"
            onClick={() => setSearch(true)}
            onChange={handleOnchange}
            ref={inputRef}
          />
          {search ? (
            <span
              style={{ cursor: "pointer" }}
              onClick={closeSearchAndClearInput}
            >
              close
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="potential__members">
          {search ? (
            searchedFriends &&
            searchedFriends.length > 0 &&
            inputRef.current.value !== "" ? (
              searchedFriends.map((item) => {
                return (
                  <PotentialGroupMember
                    key={item._id}
                    id={item._id}
                    username={item.username}
                    profile_image={item.profile_image}
                    added={item.added}
                    addMember={addMember}
                  />
                );
              })
            ) : (
              <EmptySearch />
            )
          ) : (
            friends.map((item) => {
              return (
                <PotentialGroupMember
                  key={item._id}
                  id={item._id}
                  username={item.username}
                  profile_image={item.profile_image}
                  added={item.added}
                  addMember={addMember}
                />
              );
            })
          )}
        </div>
        <div className="create__or__cancel">
          {!search ? (
            <>
              <div className="cancel" onClick={showOrCloseCreateGroup}>
                <span>Cancel</span>
              </div>
              <div className="create" onClick={createGroup}>
                <span>Create</span>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
