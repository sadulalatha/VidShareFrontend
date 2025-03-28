


// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import { useContext, useRef, useState } from "react";
import "./login.css";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { loginAsync, registerAsync } from "../../services/services";

export default function Login() {
  const { state, login } = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState("");
  const userRef = useRef(null);
  const passRef = useRef(null);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const generateGuestCredentials = () => {
    const randomNum = Math.floor(Math.random() * 10000);
    const username = `Guest${randomNum}`;
    const email = `guest${randomNum}@example.com`;
    const password = `guest${randomNum}${Math.random().toString(36).slice(2, 7)}`;
    return { username, email, password };
  };

  const handleClear = () => {
    if (passRef.current) {
      passRef.current.value = "";
    }
    if (userRef.current) {
      userRef.current.value = "";
    }
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let username = userRef.current?.value;
    const password = passRef.current?.value;

    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }
    username = capitalizeFirstLetter(username);
    try {
      const res = await loginAsync({
        name: username,
        email: username,
        password,
      });
      if (res.status === 200) {
        login(res.data);
        handleClear();
      }
    } catch (error) {
      setErrorMessage(error.response.data);
      console.log(error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const { username, email, password } = generateGuestCredentials();
      
      // First register the guest user
      const registerRes = await registerAsync({
        name: username,
        email,
        password
      });

      if (registerRes.status === 200) {
        // Then immediately login with the guest credentials
        const loginRes = await loginAsync({
          name: username,
          email,
          password
        });

        if (loginRes.status === 200) {
          login(loginRes.data);
          setErrorMessage(`Logged in as guest: ${username}`);
          handleClear();
        }
      }
    } catch (error) {
      setErrorMessage("Guest login failed. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="login">
      <div className={`wrapper ${state?.theme}`}>
        <h2 className="heading">Login</h2>
        {errorMessage && <span className="error-msg">{errorMessage}</span>}
        <form className="form" onSubmit={handleSubmit}>
          <input type="text" ref={userRef} placeholder="Username" required />
          <input
            type="password"
            ref={passRef}
            placeholder="Password"
            required
          />
          <span className="login-terms">
            By logging in you are agreeing to our Terms of Services and Privacy
            Policy.
          </span>
          <button type="submit">Login</button>
          <button type="button" onClick={handleGuestLogin} className="guest-button">
            Login as Guest
          </button>
          <div className="action">
            No Account? Sign up <Link to="/register">here.</Link>
          </div>
        </form>
      </div>
    </div>
  );
}