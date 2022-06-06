import OnlineLogo from "../img/online.svg";
import OfflineLogo from "../img/offline.svg";
import AwayLogo from "../img/away.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { UserListContext } from "../contexts/UserListContext";

export default function ListUser({
  username,
  profilepicture,
  id,
  onlinestatus,
  addFriend,
  setSearchResult,
}) {
  const { user } = useContext(UserContext);
  const { setUserList } = useContext(UserListContext);

  const makeMyFriend = (id) => {
    axios
      .post("http://localhost:12000/addFriend", {
        friendID: id,
        myId: user.id,
      })
      .then((res) => {
        axios
          .post("http://localhost:12000/getFriends", { myId: user.id })
          .then(({ data }) => {
            setUserList(data);
            setSearchResult(null);
            document.getElementById("FriendSearchBox").value = "";
          })
          .catch((e) => {
            console.log(e);
          });
      });
  };

  return (
    <li
      id={id}
      className="group w-full flex items-center rounded-md 0 py-1 px-2 cursor-pointer text-userNameBase hover:bg-userHover hover:text-userNameHover mb-1"
    >
      <div className="relative">
        <img
          className="w-12 h-12 rounded-full"
          src={`http://localhost:12000/upload/${profilepicture}`}
          alt="profile"
        />
        {!addFriend && (
          <img
            className="absolute bottom-[1px] left-8 w-3"
            src={
              onlinestatus === 0
                ? OnlineLogo
                : onlinestatus === 1
                ? AwayLogo
                : OfflineLogo
            }
            alt="Offline"
          />
        )}
      </div>
      <h3 className="ml-2 text-lg font-medium">{username}</h3>
      {addFriend && (
        <div
          onClick={() => makeMyFriend(id)}
          className="hidden group-hover:flex hover:text-iconsHover ml-auto pr-1 text-lg"
        >
          <FontAwesomeIcon icon={faUserPlus} />
        </div>
      )}
    </li>
  );
}
