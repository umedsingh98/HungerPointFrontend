import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./placeOrder.css";
const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  return (
    <form className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" placeholder="First name" />
          <input type="text" placeholder="Last name" />
        </div>
      
          <input type="email" placeholder="Email address" />
          <input type="text" placeholder="House no." />
        <div className="multi-fields">
          <input type="text" placeholder="Area" />
          <input type="text" placeholder="City" />
        </div>
        <div className="multi-fields">
          <input type="text" placeholder="State" />
          <input type="number" placeholder="Phone number" />
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
          <button id="proceed-payment" onClick={() => navigate("/order")}>
            Proceed To Payment
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
