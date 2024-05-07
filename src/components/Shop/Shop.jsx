import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  const loadCart = useLoaderData();
  const [cart, setCart] = useState(loadCart);

  // const { result } = useLoaderData();
  const [count, setCount] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(10);
  const numberOfPages = Math.ceil(count / dataPerPage);
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const storedCart = getShoppingCart();
  const storedCardIds = Object.keys(storedCart);

  const pages = [...Array(numberOfPages).keys()];
  useEffect(() => {
    fetch("http://localhost:5000/total-page")
      .then((res) => res.json())
      .then((data) => setCount(data.result));
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5000/products?page=${currentPage}&&size=${dataPerPage}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [dataPerPage, currentPage]);

  // useEffect(() => {
  //   const savedCart = [];
  //   // step 1: get id of the addedProduct
  //   for (const id in storedCart) {
  //     // step 2: get product from products state by using id
  //     const addedProduct = products.find((product) => product._id === id);
  //     if (addedProduct) {
  //       // step 3: add quantity
  //       const quantity = storedCart[id];
  //       addedProduct.quantity = quantity;
  //       // step 4: add the added product to the saved cart
  //       savedCart.push(addedProduct);
  //     }
  //     // console.log('added Product', addedProduct)
  //   }
  //   // step 5: set the cart
  //   setCart(savedCart);
  // }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };
  const handleChange = (e) => {
    setDataPerPage(e.target.value);
    setCurrentPage(0);
  };
  const handleClick = (page) => {
    setCurrentPage(page);
  };
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (pages.length - 1 > currentPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <button onClick={handlePrev}>prev</button>
        {pages.map((page) => (
          <button
            className={`${page === currentPage ? "selected" : ""}`}
            onClick={() => handleClick(page)}
            key={page}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNext}>Next</button>
        <select onChange={handleChange} value={dataPerPage}>
          <option value="10">10</option>
          <option value="40">40</option>
          <option value="30">30</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
