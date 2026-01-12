import React, { useContext, useState, useEffect } from "react";
import "../FoodDisplay/foodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../Food Item/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list, page, setPage, totalPages, fetchFoodList } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (Array.isArray(food_list)) {
      setLoading(false);
    }
  }, [food_list]);

  // Refetch when category changes - reset to page 1 and exit showAll mode
  useEffect(() => {
    setPage(1);
    setShowAll(false);
    fetchFoodList({ page: 1, category });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    // fetch for the new page, preserve category filter when provided
    fetchFoodList({ page: p, category });
  };

  return (
    <div id="food-section" className="food-display">
      <h2>Top dishes near you</h2>
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
          <h3>Loading products...</h3>
        </div>
      ) : (
        <>
          <div className="food-display-list">
            {food_list?.map((item, index) => {
              return (
                <FoodItem
                  key={item._id || index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              );
            })}
          </div>

          <div className="pagination">
            {!showAll ? (
              <>
                <button
                  className="page-button"
                  onClick={() => { setShowAll(false); goToPage(page - 1); }}
                  disabled={page <= 1}
                >
                  Prev
                </button>

                {/* show page numbers - simple range */}
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      className={`page-number ${p === page ? 'active' : ''}`}
                      onClick={() => { setShowAll(false); goToPage(p); }}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  className="page-button"
                  onClick={() => { setShowAll(false); goToPage(page + 1); }}
                  disabled={page >= totalPages}
                >
                  Next
                </button>

                <button
                  className="page-button show-all"
                  onClick={() => { setShowAll(true); fetchFoodList({ page: 1, category, all: true }); }}
                >
                  Show all
                </button>
              </>
            ) : (
              <button
                className="page-button show-all"
                onClick={() => { setShowAll(false); fetchFoodList({ page: 1, category }); }}
              >
                Show paginated
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FoodDisplay;
