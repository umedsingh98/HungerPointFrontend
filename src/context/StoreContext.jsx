import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (prop) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://hungerpointbackend.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  console.log(cartItems);
  console.log("list above");
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]:1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId]+1 }));
    }
    
    if(token){
      await axios.post(url+"/api/cart/add",{itemId},{headers: {token}});
    }
  };


  const removeFromCart = async (itemId) => {
    console.log(`item id is: ${(itemId)}`);
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId]-1 }));
    if(token){
      await axios.post(url+"/api/cart/remove",{itemId},{headers: {token}});
    }
  }
  ;

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const items = await axios.get(url + "/api/food/list");
    console.log("ashu");
    console.log(items.data.data);
    setFoodList(items.data.data);
  };

  const loadCartData = async (token) =>{
    const response = await axios.post(url + "/api/cart/get", {},{headers: {token}});
    setCartItems(response.data.data);
    console.log(response.data,"cart data");  
  }

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);
  const contextValue = {
    //The data in contextValue Object can be used anywhere in project just by using useContext() state.
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {prop.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
