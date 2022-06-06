import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import { Routes, Route, Link } from "react-router-dom";
import OnlineLogo from "../img/online.svg";
import OfflineLogo from "../img/offline.svg";
import AwayLogo from "../img/away.svg";
import { UserListContext } from "../contexts/UserListContext";
import { CurrentMessengerContext } from "../contexts/CurrentMessengerContext";
import { useEffect, useState } from "react";
import ListUser from "./ListUser";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import InputBox from "./InputBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

axios.defaults.withCredentials = true;

export default function App() {
  const [userList, setUserList] = useState(null);
  const [user, setUser] = useState(null);
  const [currentMessenger, setCurrentMessenger] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (document.getElementById("FriendSearchBox")) {
      document
        .getElementById("FriendSearchBox")
        .addEventListener("keyup", (e) => {
          if (e.target.value === "") return setSearchResult(null);
          axios
            .post("http://localhost:12000/searchUsers", {
              username: e.target.value,
            })
            .then((res) => {
              setSearchResult(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        });
    }
  }, [user]);

  const logout = () => {
    axios
      .get("http://localhost:12000/logout")
      .then(() => {
        window.location.href = "/login";
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openModal = (user) => {
    if (modal) {
      if (modal.username === user.username) {
        return setModal(null);
      }
    }
    setModal(user);
  };

  const getCurrentMessengerDetails = (id) => {
    let curMessageUser = userList.filter((obj) => {
      return obj.id === id;
    });
    setCurrentMessenger(curMessageUser[0]);
  };

  useEffect(() => {
    axios
      .get("http://localhost:12000/getUserData")
      .then(({ data }) => {
        let initUser = { ...data[0] };
        initUser.onlinestatus = 0;
        setUser(initUser);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <UserListContext.Provider value={{ userList, setUserList }}>
      <UserContext.Provider value={{ user, setUser }}>
        <CurrentMessengerContext.Provider
          value={{ currentMessenger, setCurrentMessenger }}
        >
          <div
            className={`fixed bottom-2 left-60 rounded-md z-20 bg-userCard shadow-md transition-all ease-in p-4 ${
              modal
                ? `opacity-100 w-80 bottom=${
                    document.getElementById(modal.id).bottom
                  }`
                : "opacity-0 w-0"
            }`}
          >
            {modal && (
              <>
                <img
                  src={`http://localhost:12000/upload/${modal.profilepicture}`}
                  alt="profilepicture"
                  className={`w-24 rounded-full opacity-100 ml-2 mb-4 ${
                    modal.id === user.id && "hover:opacity-30 cursor-pointer"
                  } `}
                />
                <div className="text-3xl text-userNameHover">
                  {modal.username}
                </div>
                <div
                  contentEditable={modal.id === user.id}
                  className="font-semibold text-sm text-userNameHover"
                >
                  About
                </div>
                <div className="text-sm">{modal.about}</div>
              </>
            )}
          </div>
          <div className="w-screen h-screen bg-background text-white flex flex-col select-none overflow-hidden">
            {user && (
              <div className="flex flex-row h-11 w-full shadow-md z-10 shrink-0">
                <div className="w-60 bg-sidebar h-full flex justify-center items-center px-2">
                  <InputBox placeholder="Find friends" id="FriendSearchBox" />
                </div>
                <span className="h-full flex grow items-center">
                  {currentMessenger && (
                    <>
                      <p className="opacity-50 ml-4 mr-1 font-bold">@</p>
                      <p className="opacity-90 select-text font-medium">
                        {currentMessenger.username}
                      </p>
                      <img
                        className="w-3 ml-1"
                        src={
                          currentMessenger.onlinestatus === 0
                            ? OnlineLogo
                            : currentMessenger.onlinestatus === 1
                            ? AwayLogo
                            : OfflineLogo
                        }
                        alt="Offline"
                      />
                    </>
                  )}
                </span>
                <div className="h-full w-28 p-2">
                  <button
                    className="bg-searchBar rounded-md w-full h-full hover:bg-messageHover"
                    onClick={logout}
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-row h-full">
              {user && (
                <aside className="bg-sidebar w-60 p-1 shrink-0 flex flex-col justify-between">
                  {!searchResult ? (
                    <>
                      <div>
                        <p className="font-medium opacity-70 pl-2 pt-2">
                          Friends
                        </p>
                        <ul>
                          {userList &&
                            userList.map((element) => {
                              return (
                                <div
                                  key={element.id}
                                  onClick={() => {
                                    getCurrentMessengerDetails(element.id);
                                  }}
                                  onAuxClick={(e) => openModal(element)}
                                  onContextMenu={(e) => e.preventDefault()}
                                >
                                  <ListUser
                                    username={element.username}
                                    profilepicture={element.profilepicture}
                                    id={element.id}
                                    onlinestatus={element.onlinestatus}
                                  />
                                </div>
                              );
                            })}
                        </ul>
                      </div>
                      <div className="mb-12">
                        <ul
                          onClick={() => openModal(user)}
                          onAuxClick={() => openModal(user)}
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          {user && (
                            <ListUser
                              key={user.id}
                              username={user.username}
                              profilepicture={user.profilepicture}
                              id={user.id}
                              onlinestatus={user.onlinestatus}
                            />
                          )}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium opacity-70 pl-2 pt-2">
                          Search results
                        </p>
                        <ul>
                          {searchResult.map((element) => {
                            if (element.username === user.username) return null;
                            return (
                              <div key={element.id}>
                                <ListUser
                                  username={element.username}
                                  profilepicture={element.profilepicture}
                                  id={element.id}
                                  addFriend
                                  setSearchResult={setSearchResult}
                                />
                              </div>
                            );
                          })}
                        </ul>
                      </div>
                    </>
                  )}
                </aside>
              )}
              <main className="flex flex-col grow relative justify-between">
                {user ? (
                  <Routes>
                    <Route path="/signup" element={<Signup />}></Route>
                    <Route path="/*" element={<Home />}></Route>
                  </Routes>
                ) : (
                  <Routes>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/*" element={<Signup />}></Route>
                  </Routes>
                )}
              </main>
            </div>
          </div>
        </CurrentMessengerContext.Provider>
      </UserContext.Provider>
    </UserListContext.Provider>
  );
}
