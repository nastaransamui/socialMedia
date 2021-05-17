import axios from "axios";
import { useRef } from "react";
import { useHistory } from "react-router";
import "./register.css";

const Register = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const repeatPassword = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    if (repeatPassword.current.value !== password.current.value) {
      repeatPassword.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        history.push("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social Network</h3>
          <span className="loginDesc">
            Connect with firends and the world around you:{" "}
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              type="text"
              placeholder="User Name"
              className="loginInput"
              ref={username}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="loginInput"
              ref={email}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="loginInput"
              ref={password}
              required
              minLength="4"
            />
            <input
              type="password"
              placeholder="Repeat Password"
              className="loginInput"
              ref={repeatPassword}
              required
              minLength="4"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button className="loginRegisterButton" onClick={()=> {history.push("/login")}}>Log into Account</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
