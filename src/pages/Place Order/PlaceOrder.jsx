import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./placeOrder.css";

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, food_list, url, token, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    house: "",
    area: "",
    city: "",
    state: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    // Prepare items array
    const items = Object.entries(cartItems)
      .filter(([id, qty]) => qty > 0)
      .map(([id, qty]) => {
        const food = food_list.find(f => f._id === id);
        return food ? { _id: id, name: food.name, qty, price: food.price } : null;
      })
      .filter(Boolean);
    
    const amount = getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 30);
    const address = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      house: form.house,
      area: form.area,
      city: form.city,
      state: form.state,
      phone: form.phone
    };
    
    console.log("Submitting order:", { items, amount, address });
    
    if (!items.length) {
      setMessage("Cart is empty.");
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(url + "/api/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ items, amount, address })
      });
      
      console.log("Order response status:", res.status);
      const data = await res.json();
      console.log("Order response data:", data);

      if(!token){
        setMessage("You must be logged in to place an order.");
        setLoading(false);
        return;
      }
      
      if (data.success) {
        setMessage("Order placed successfully!");
        setCartItems({});
        // Navigate to profile page after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setMessage(data.message || "Order failed.");
      }
    } catch (err) {
      console.error("Order error:", err);
      setMessage("Order failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" placeholder="First name" name="firstName" value={form.firstName} onChange={handleChange} required />
          <input type="text" placeholder="Last name" name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <input type="email" placeholder="Email address" name="email" value={form.email} onChange={handleChange} required />
        <input type="text" placeholder="House no." name="house" value={form.house} onChange={handleChange} required />
        <div className="multi-fields">
          <input type="text" placeholder="Area" name="area" value={form.area} onChange={handleChange} required />
          <input type="text" placeholder="City" name="city" value={form.city} onChange={handleChange} required />
        </div>
        <div className="multi-fields">
          <input type="text" placeholder="State" name="state" value={form.state} onChange={handleChange} required />
          <input type="number" placeholder="Phone number" name="phone" value={form.phone} onChange={handleChange} required />
        </div>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-detail">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <p>Delivery</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 30}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <b>Total</b>
              <b>{getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 30)}</b>
            </div>
          </div>
          <button id="proceed-payment" type="submit" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
          {message && <div className="order-message">{message}</div>}
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
