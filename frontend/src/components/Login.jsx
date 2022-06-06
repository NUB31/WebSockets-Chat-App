import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import InputBox from "./InputBox";
import axios from "axios";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState(false);

  const login = (e) => {
    e.preventDefault();
    let username = document.getElementById("usernameInput").value;
    let password = document.getElementById("passwordInput").value;
    axios
      .post(`http://localhost:12000/login`, {
        username: username,
        password: password,
      })
      .then(() => {
        window.location.href = "/";
      })
      .catch((e) => {
        console.log(e.code);
        setError("Failed to log in");
      });
  };
  return (
    <form
      className="flex h-full items-center justify-center flex-col"
      onSubmit={(e) => login(e)}
      id="messageForm"
    >
      <div className="w-2/5 ">
        <h2 className="w-full text-2xl font-medium">Log in</h2>
        <InputBox
          id="usernameInput"
          icon={faUser}
          placeholder="Username or email"
          title="Username or email"
          error={error}
        />
        <InputBox
          id="passwordInput"
          icon={faLock}
          placeholder="Password"
          title="Password"
          type="password"
          error={error}
        />
        <div className="w-full flex justify-end">
          <button
            className="bg-messageBox p-2 px-4 rounded-md mt-2 hover:bg-messageHover"
            type="submit"
          >
            Log in
          </button>
        </div>
        <Link className="hover:underline flex justify-center" to="/signup">
          No account? Sign up here!😎
        </Link>
      </div>
    </form>
  );
}
