import React, { useContext, useState, useEffect } from 'react';
import '../FoodDisplay/foodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../Food Item/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (food_list) {
      setLoading(false);
    }
  }, [food_list]);

  return (
    <div className="food-display">
      <h2>Top dishes near you</h2>
      {loading ? (
        <div className="loader"><h1>Loading...</h1></div>
      ) : (
        <div className="food-display-list">
          {food_list?.map((item, index) => {
            if (category === 'All' || category === item.category) {
              return (
                <FoodItem
                  key={index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
