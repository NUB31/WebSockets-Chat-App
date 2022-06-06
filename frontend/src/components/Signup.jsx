import {
  faUser,
  faLock,
  faIdCard,
  faAt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import InputBox from "./InputBox";
import axios from "axios";
import { useState } from "react";

export default function Signup() {
  const [error, setError] = useState(false);

  const signup = (e) => {
    e.preventDefault();
    let fullname = document.getElementById("fullname").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    axios
      .post(`http://localhost:12000/newUser`, {
        fullname: fullname,
        username: username,
        password: password,
        email: email,
        phone: phone,
      })
      .then((res) => {
        window.location.href = "/login";
      })
      .catch((e) => {
        console.log(e);
        setError("Username already exists");
      });
  };
  return (
    <form
      className="flex h-full items-center justify-center flex-col"
      onSubmit={(e) => signup(e)}
      id="messageForm"
    >
      <div className="w-2/5 ">
        <h2 className="w-full text-2xl font-medium">Sign up</h2>
        <InputBox
          id="fullname"
          icon={faIdCard}
          placeholder="Name"
          title="Full name"
          error={error}
        />
        <InputBox
          id="username"
          icon={faUser}
          placeholder="Username"
          title="Username"
          error={error}
        />
        <InputBox
          id="password"
          icon={faLock}
          placeholder="Password"
          title="Password"
          type="password"
          error={error}
        />
        <InputBox
          id="email"
          icon={faAt}
          placeholder="Email"
          title="Email address"
          error={error}
          type="email"
        />
        <InputBox
          id="phone"
          icon={faPhone}
          placeholder="Phone"
          title="Phone number"
          error={error}
          type="tel"
        />
        <div className="w-full flex justify-end">
          <button
            className="bg-messageBox p-2 px-4 rounded-md mt-2 hover:bg-messageHover"
            type="submit"
          >
            Sign up
          </button>
        </div>
        <Link className="hover:underline flex justify-center" to="/login">
          Already signed up? Log in here!😍
        </Link>
      </div>
    </form>
  );
}
