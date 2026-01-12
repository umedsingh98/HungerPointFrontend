import axios from "axios";
import { createContext, useEffect, useState, useRef } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (prop) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://hungerpointbackend.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  // Track the last fetch options to avoid an immediate redundant refetch when fetchFoodList sets page programmatically
  const lastFetchRef = useRef({ all: false, page: null });

  console.log("Cart Items: ", cartItems);
  console.log("list above");
  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const current = prev || {};
      if (!current[itemId]) {
        return { ...current, [itemId]: 1 };
      } else {
        return { ...current, [itemId]: (current[itemId] || 0) + 1 };
      }
    });

    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };


  const removeFromCart = async (itemId) => {
    console.log(`item id is: ${(itemId)}`);
    setCartItems((prev) => {
      const current = prev || {};
      const newCount = (current[itemId] || 0) - 1;
      if (newCount > 0) {
        return { ...current, [itemId]: newCount };
      } else {
        // Remove item if count drops to 0 or below
        const { [itemId]: _, ...rest } = current;
        return rest;
      }
    });
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };


  const getTotalCartAmount = () => {
    let totalAmount = 0;
    const currentCart = cartItems || {};
    for (const item of Object.keys(currentCart)) {
      const qty = currentCart[item];
      if (qty > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * qty;
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async (opts = {}) => {
    try{
      const currentPage = opts.page || page || 1;
      const category = opts.category;
      const showAll = opts.all;
      let query = `?page=${currentPage}&limit=${limit}`;
      if (showAll) query += `&all=true`;
      // don't send a category filter for "All" (client uses "All" to show everything)
      if (category && category !== "All") query += `&category=${encodeURIComponent(category)}`;

      const items = await axios.get(url + "/api/food/list" + query);

      // Normalize the returned array
      const all = Array.isArray(items.data.data) ? items.data.data : [];

      // Apply client-side filtering by category if requested (helps when server doesn't filter)
      let filtered = all;
      if (category && category !== "All") {
        filtered = all.filter((it) => (it.category || "").toString() === category.toString());
      }

      // If client requested all items, return the full filtered list (no slicing)
      if (showAll) {
        setFoodList(filtered);
        setTotalItems(filtered.length);
        setTotalPages(1);
        setPage(1);
        // Record that we fetched 'all' and set page to 1 so the page-change effect can avoid refetching
        lastFetchRef.current = { all: true, page: 1 };
        return;
      }

      // Compute pagination based on filtered results (always apply client-side pagination to be predictable)
      const total = filtered.length;
      const tp = Math.max(1, Math.ceil(total / limit));
      const clampedPage = Math.min(Math.max(1, items.data.pagination?.page || currentPage), tp);

      setTotalPages(tp);
      setTotalItems(total);
      setPage(clampedPage);

      // Record that the last fetch was NOT 'all' and which page we have loaded
      lastFetchRef.current = { all: false, page: clampedPage };

      const start = (clampedPage - 1) * limit;
      const paged = filtered.slice(start, start + limit);
      setFoodList(paged);

      // If server returned pagination but it doesn't match the filtered results, warn for visibility
      if (items.data.pagination && (items.data.pagination.total !== total || items.data.pagination.page !== clampedPage)) {
        console.warn('Server pagination metadata did not match filtered results; applied client-side pagination and filtering.');
      }
    }catch(err){
      console.error('Failed to fetch food list', err);
      setFoodList([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  };

  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
    // Ensure we always have an object for cartItems
    setCartItems(response.data.data || {});
    console.log(response.data, "cart data");
  }

  useEffect(() => {
    async function loadData() {
      await fetchFoodList({ page });
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  // Refetch when page changes (but avoid re-fetching if the last fetch already requested 'all' and set page)
  useEffect(() => {
    // If the last fetch was an 'all' fetch and it set the same page, skip this redundant refetch
    if (lastFetchRef.current?.all && lastFetchRef.current.page === page) {
      // Clear the 'all' marker so subsequent intentional page changes will fetch normally
      lastFetchRef.current = { all: false, page: null };
      return;
    }
    fetchFoodList({ page });
  }, [page]);

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
    setToken,
    // Pagination
    page,
    setPage,
    totalPages,
    totalItems,
    limit,
    fetchFoodList
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {prop.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
