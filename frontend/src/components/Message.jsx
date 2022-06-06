import { faPen, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { CurrentMessengerContext } from "../contexts/CurrentMessengerContext";
import { UserContext } from "../contexts/UserContext";

export default function Message({
  message,
  username,
  profilepicture,
  notMe,
  sameSender,
  id,
  socket,
}) {
  const { currentMessenger } = useContext(CurrentMessengerContext);
  const { user } = useContext(UserContext);

  const editMessage = (id) => {
    [...document.getElementById(id).childNodes].forEach((element) => {
      if (element.id === "messageId") {
        [...element.childNodes].forEach((element) => {
          if (element.tagName === "P") {
            element.contentEditable = "true";
            element.style.backgroundColor = "#202225";
            element.focus();
            element.addEventListener("keydown", (e) => {
              if (e.keyCode === 13) {
                e.preventDefault();
                if (element.innerHTML === "<br>") return;
                element.contentEditable = "false";
                element.style.backgroundColor = "";
                socket.current.emit("edit message", {
                  userid: user.id,
                  userto: currentMessenger.id,
                  msgId: id,
                  messageContent: element.innerText,
                });
              } else if (e.keyCode === 27) {
                e.preventDefault();
                element.contentEditable = "false";
                element.style.backgroundColor = "";
              }
            });
          }
        });
      }
    });
  };

  const deleteMessage = (id) => {
    socket.current.emit("delete message", {
      msgId: id,
    });
  };

  return (
    <>
      {!sameSender ? (
        <li
          id={id}
          className="flex flex-row w-full pl-4 hover:bg-messageHover relative group"
        >
          <img
            className="w-12 h-12 p-1 rounded-full"
            src={`http://localhost:12000/upload/${profilepicture}`}
            alt="profile"
          />
          <div
            id="messageId"
            className="grow ml-4 select-text flex flex-col justify-between"
          >
            <h3 className="text-lg font-medium opacity-80">{username}</h3>
            <p
              dangerouslySetInnerHTML={{ __html: message }}
              className="focus:outline-none truncate hover:text-clip"
            />
          </div>
          <div className="flex justify-around items-center opacity-0 group-hover:opacity-100 absolute -top-3 right-8 rounded-md border-2 bg-hoverMenu border-hoverMenuBorder">
            {notMe && (
              <>
                <FontAwesomeIcon
                  className="p-2 text-lg text-iconsBase hover:text-iconsHover hover:bg-hoverMenuHover rounded-md cursor-pointer"
                  icon={faPen}
                  onClick={() => editMessage(id)}
                />
                <FontAwesomeIcon
                  className="p-2 text-lg text-iconsBase hover:text-iconsHover hover:bg-hoverMenuHover rounded-md cursor-pointer"
                  icon={faTrash}
                  onClick={() => deleteMessage(id)}
                />
              </>
            )}
          </div>
        </li>
      ) : (
        <li
          id={id}
          className="flex flex-row w-full hover:bg-messageHover relative group pl-20 select-text"
        >
          <div className="flex justify-around items-center opacity-0 group-hover:opacity-100 absolute -top-3 right-8 rounded-md border-2 bg-hoverMenu border-hoverMenuBorder">
            {notMe && (
              <>
                <FontAwesomeIcon
                  className="p-2 text-lg text-iconsBase hover:text-iconsHover hover:bg-hoverMenuHover rounded-md cursor-pointer"
                  icon={faPen}
                  onClick={() => editMessage(id)}
                />
                <FontAwesomeIcon
                  className="p-2 text-lg text-iconsBase hover:text-iconsHover hover:bg-hoverMenuHover rounded-md cursor-pointer"
                  icon={faTrash}
                  onClick={() => deleteMessage(id)}
                />
              </>
            )}
          </div>
          <div id="messageId" className="w-full">
            <p
              dangerouslySetInnerHTML={{ __html: message }}
              className="focus:outline-none"
            />
          </div>
        </li>
      )}
    </>
  );
}
