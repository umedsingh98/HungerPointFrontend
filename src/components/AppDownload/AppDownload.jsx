import { assets } from "../../assets/frontend/assets";
import "../AppDownload/appDownload.css";
import React from "react";

const AppDownload = () => {
  return (
    <>
      <div className="app-download" id="app-download">
        <p>
          For Better Experience Download<br/>HungerPoint App
        </p>
        <div className="app-download-plateforms">
          <img src={assets.app_store} alt="" />
          <img src={assets.play_store} alt="" />
        </div>
      </div>
    </>
  );
};

export default AppDownload;
