import React, { useContext } from 'react'
import './cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import trash from "../../assets/frontend/trash.png";
const Cart = () => {

  const {url, food_list, cartItems, removeFromCart, getTotalCartAmount} = useContext(StoreContext);

  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Qty.</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br/>
        <hr/>
        {food_list.map((foodItem, index) => {
           console.log("food items: ",foodItem)
          if(cartItems[foodItem._id] > 0){
            return(
              <>
              <div className='cart-items-item'>
                <img src={url+"/images/"+foodItem.image} alt="foodItemImage" />
                <p>{foodItem.name}</p>
                <p>Rs. {foodItem.price}</p>
                <p>{cartItems[foodItem._id]}</p>
                <p>Rs. {cartItems[foodItem._id] * foodItem.price}</p>
                <p onClick={() => {removeFromCart(foodItem._id)}} className='cross'><img style={{width: "25px", height: "25px"}} src={trash} alt="X" /></p>
              </div>
              <hr />
              </>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
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
          <button onClick={() => navigate('/order')}>Proceed To Checkout</button>
        </div>
        <div className="cart-promocode">
          <p>Have a Promocode?</p>
          <div className="cart-promocode-input">
            <input type="text" placeholder='Promo code'/>
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart