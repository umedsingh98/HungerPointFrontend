import React, { useEffect, useState, useContext } from 'react';
import './profile.css';
import profileIcon from '../../assets/frontend/profile_icon.png';
import { StoreContext } from '../../context/StoreContext';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '', avatar: '' });

  const token = localStorage.getItem('token');
  const { url } = useContext(StoreContext);

  useEffect(() => {
    fetch(url + '/api/user/profile', {
      headers: { token },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
          setForm({
            name: data.user.name || '',
            address: data.user.address || '',
            phone: data.user.phone || '',
            avatar: data.user.avatar || '',
          });
        }
      });
    fetch(url + '/api/user/orders/history', {
      headers: { token },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Order history response:", data);
        if (data.success) setOrders(data.orders);
      })
      .catch(err => {
        console.error("Error fetching order history:", err);
      });
  }, [token, url]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = e => {
    e.preventDefault();
    fetch(url + '/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', token },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
          setEditMode(false);
        } else {
          alert(data.message);
        }
      });
  };

  if (!user) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-info">
        <img
          src={user.avatar || profileIcon}
          alt="avatar"
          className="profile-avatar"
        />
        {editMode ? (
          <form className="profile-form" onSubmit={handleSave}>
            <label>Name: <input name="name" value={form.name} onChange={handleChange} /></label>
            <label>Address: <input name="address" value={form.address} onChange={handleChange} /></label>
            <label>Phone: <input name="phone" value={form.phone} onChange={handleChange} /></label>
            <label>Avatar URL: <input name="avatar" value={form.avatar} onChange={handleChange} /></label>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        ) : (
          <div className="profile-details">
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Address:</b> {user.address || '-'}</p>
            <p><b>Phone:</b> {user.phone || '-'}</p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        )}
      </div>
      <h3>Order History</h3>
      <div className="order-history">
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul>
            {orders.map(order => (
              <li key={order._id} className="order-item">
                <div><b>Date:</b> {new Date(order.date).toLocaleString()}</div>
                <div><b>Status:</b> {order.status}</div>
                <div><b>Amount:</b> ${order.amount}</div>
                <div><b>Items:</b> {order.items.map(item => {
                  // Handle different item structures
                  if (typeof item === 'string') return item;
                  if (item.name) return item.name;
                  if (item._id) return `Item ${item._id}`;
                  return 'Unknown item';
                }).join(', ')}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile; 