import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPoo } from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { UserListContext } from "../contexts/UserListContext";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import Message from "./Message";
import { CurrentMessengerContext } from "../contexts/CurrentMessengerContext";
axios.defaults.withCredentials = true;

export default function Home({ updateCurrentMessenger }) {
  const { userList, setUserList } = useContext(UserListContext);
  const { currentMessenger } = useContext(CurrentMessengerContext);
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState(null);
  const socket = useRef(null);
  const messageBox = useRef(null);
  let curSender = false;
  const atBottom = useRef(false);
  const messageBoxHasEventListner = useRef(false);

  useEffect(() => {
    socket.current = io(`ws://localhost:12000`);
    socket.current.emit("setOnlineStatus", { status: 0, id: user.id });
    getFriends();
    socket.current.on("setOnlineClientStatus", () => {
      getFriends();
    });
  }, []);

  const sendFile = () => {
    let fd = new FormData();
    fd.append(
      "userpic",
      document.getElementById("fileBox").files[0],
      document.getElementById("fileBox").files[0].name
    );
    axios({
      method: "post",
      url: "http://localhost:12000/upload",
      data: fd,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(({ data }) => {
        socket.current.emit("chat message", {
          msg: `<img src="${data.location}" style="width: 500px; height: auto; border-radius: 14px;">`,
          userid: user.id,
          userto: currentMessenger.id,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const startListner = (data) => {
    let cachedData = null;
    socket.current.on("editMessage", ({ msgId, messageContent }) => {
      if (document.getElementById(msgId)) {
        [...document.getElementById(msgId).childNodes].forEach((element) => {
          if (element.id === "messageId") {
            [...element.childNodes].forEach((element) => {
              if (element.tagName === "P") {
                element.innerText = messageContent;
              }
            });
          }
        });
      }
    });
    socket.current.on("deleteMessage", ({ msgId }) => {
      if (document.getElementById(msgId)) {
        document.getElementById(msgId).outerHTML = "";
      }
    });
    socket.current.on("newMessage", ({ from, id, msg }) => {
      if (from === parseInt(currentMessenger.id) || from === user.id) {
        if (!cachedData) {
          cachedData = data;
        }
        let curMessageUser = userList.filter((obj) => {
          return obj.id === from;
        });
        let messageFrom = [curMessageUser[0]];
        if (messageFrom[0] === undefined) {
          messageFrom[0] = {
            username: user.username,
            id: user.id,
            profilepicture: user.profilepicture,
          };
        }
        let newArr = [...cachedData];
        newArr.push({
          username: messageFrom[0].username,
          messagecontent: msg,
          userid: messageFrom[0].id,
          profilepicture: messageFrom[0].profilepicture,
          id: id,
        });
        setMessages(newArr);
        cachedData = newArr;
      } else {
        if (!cachedData) {
          cachedData = data;
        }
        let newArr = [...cachedData];
        setMessages(newArr);
        cachedData = newArr;
      }
    });
  };

  useEffect(() => {
    if (!messageBoxHasEventListner.current) {
      messageBox.current.addEventListener("scroll", () => {
        if (
          messageBox.current.scrollHeight - messageBox.current.scrollTop ===
          messageBox.current.clientHeight
        )
          return (atBottom.current = true);
        atBottom.current = false;
      });
      messageBoxHasEventListner.current = true;
    }

    if (atBottom.current) {
      scrollToEnd();
    }
  }, [messages]);

  useEffect(() => {
    if (!currentMessenger) return;
    axios
      .post("http://localhost:12000/getMessages", {
        userId: parseInt(user.id),
        userFrom: parseInt(currentMessenger.id),
      })
      .then(({ data }) => {
        setMessages(data);
        startListner(data);
        setTimeout(() => {
          scrollToEnd();
          atBottom.current = true;
        }, 1);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currentMessenger, user]);

  const getFriends = () => {
    axios
      .post("http://localhost:12000/getFriends", { myId: user.id })
      .then(({ data }) => {
        setUserList(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!document.getElementById("messageBox").value) return;
    socket.current.emit("chat message", {
      msg: document.getElementById("messageBox").value,
      userid: user.id,
      userto: currentMessenger.id,
    });
    document.getElementById("messageBox").value = "";
  };

  const scrollToEnd = () => {
    if (messageBox.current)
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
  };

  return (
    <>
      <ul
        className="flex flex-col overflow-auto mb-10 h-screen"
        ref={messageBox}
      >
        <li className="mt-auto"></li>
        {messages &&
          messages.map((element, index) => {
            let notme = () => {
              if (element.userid === user.id) return true;
              else return false;
            };
            let sameSender = () => {
              if (element.userid === curSender) return true;
              else return false;
            };
            let samesender = sameSender();
            let me = notme();
            curSender = element.userid;
            return (
              <Message
                id={element.id}
                message={element.messagecontent}
                username={element.username}
                profilepicture={element.profilepicture}
                key={index}
                notMe={me}
                sameSender={samesender}
                socket={socket}
              />
            );
          })}
      </ul>
      {currentMessenger && (
        <div className="p-2 mt-4 sticky bottom-0 right-0 w-full h-14 bg-background">
          <form
            id="messageForm"
            className="flex items-center justify-center bg-messageBox w-full h-10 rounded-lg"
            onSubmit={(e) => sendMessage(e)}
          >
            <FontAwesomeIcon
              className="p-3 text-xl text-iconsBase hover:text-iconsHover cursor-pointer"
              icon={faCirclePlus}
              onClick={() => document.getElementById("fileBox").click()}
            />
            <input
              id="messageBox"
              className="grow h-full rounded-lg px-2 bg-messageBox focus:outline-none"
              type="text"
              name="message"
              autoComplete="off"
              placeholder={`Message ${currentMessenger.username}`}
            />
            <input
              className="hidden"
              type="file"
              name="file"
              accept="image/png, image/gif, image/jpeg, image/jpg"
              id="fileBox"
              onChange={sendFile}
            />
            <input
              className="hidden"
              type="submit"
              name="submit"
              id="submitBtn"
            />
            <FontAwesomeIcon
              className="p-3 text-xl text-iconsBase hover:text-iconsHover cursor-pointer"
              icon={faPoo}
              onClick={() => document.getElementById("submitBtn").click()}
            />
          </form>
        </div>
      )}
    </>
  );
}
