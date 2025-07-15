import React, { useContext, useState } from "react";
import "./navbar.css";
import { assets } from "../../assets/frontend/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";
const Navbar = ({setShowLogin}) => {
  
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken} = useContext(StoreContext);

  const navigate = useNavigate();
  const logout = () => {
     localStorage.removeItem("token");
     setToken("");
     navigate("/");
  }
  return (
    <div className="navbar">
      <Link to="/"><div className="logo">
        <img src={assets.logo} alt="logo" />
        <h2>
          Hunger<span id="point">Point</span>
        </h2>
      </div>
      </Link>
      <ul className="navbar-menu">
        <Link to="/"
          onClick={() => {
            setMenu("home");
          }}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <Link
          onClick={() => {
            setMenu("menu");
          }}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </Link>
        <li
          onClick={() => {
            setMenu("mobile-app");
          }}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile-app
        </li>
        <li
          onClick={() => {
            setMenu("contact-us");
          }}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} className="img-fluid" alt="search" />
        <div className="navbar-search-icon">
          <Link to="/cart"><img src={assets.basket_icon} alt="basket" /></Link>
          <div className={getTotalCartAmount() === 0 ?"":"dot"}></div>
        </div>
        {
          !token?<button onClick={() => setShowLogin(true)} className="signIn">Sign In</button>
          :
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="user" />
            <ul className="nav-profile-dropdown">
              <li><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        }
      </div>
    </div>
  );
};

export default Navbar;
