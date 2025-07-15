import React from "react";
import "../ExploreMenu/exploreMenu.css";
import { menu_list } from "../../assets/frontend/assets";
const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ut dolor
        debitis quod iusto, quos dolorem, maiores omnis, tenetur in vel labore
        ducimus nam quis praesentium obcaecati odit. Consequatur, velit! Lorem
        ipsum dolor sit amet, consectetur adipisicing elit. Voluptas, atque
        maiores facere libero laborum repudiandae placeat sed, eveniet impedit?
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => (
          <div
            onClick={() =>
              setCategory((prev) =>
                prev === item.menu_name ? "All" : item.menu_name
              )
            }
            className="explore-menu-list-item"
            key={index}
          >
            <img
              className={category === item.menu_name ? "active" : ""}
              src={item.menu_image}
              alt={item.menu_name}
            />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
