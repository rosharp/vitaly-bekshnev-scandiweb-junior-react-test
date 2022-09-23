// TODO: fix find() method on onAdd

import React, { Component, PureComponent, useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Product from "./components/Product";
import Cart from "./components/Cart";
import withQuery from "./apollo/data";

class App extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleCurrency = this.handleCurrency.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onQtyIncrease = this.onQtyIncrease.bind(this);
    this.onQtyDecrease = this.onQtyDecrease.bind(this);
    this.onCartItemDelete = this.onCartItemDelete.bind(this);

    this.state = {
      category: "all",
      currency: "USD",
      cartItems: [],
    };
  }

  handleClick(e) {
    this.setState({ category: e.target.innerHTML });
  }

  handleCurrency(e) {
    this.setState({ currency: e.target.innerHTML });
  }

  onAdd(product) {
    const exist = this.state.cartItems.find(
      (item) =>  item.id === product.id && JSON.stringify(item.chars) === JSON.stringify(product.chars)
    );

    if (exist) {
      this.setState({
        cartItems: this.state.cartItems.map((item) =>
          (item.id === product.id && JSON.stringify(item.chars) === JSON.stringify(product.chars))
            ? { ...exist, qty: exist.qty + 1} 
            : item 
        ),
      });
      console.log(product)
    } else {
      this.setState({
        cartItems: [...this.state.cartItems, { ...product, qty: 1 }],
      });
    }
  }

  onQtyIncrease(product) {
    const exist = this.state.cartItems.find(
      (item) => item.name === product.name && item.chars === product.chars
    );

    if (exist) {
      this.setState({
        cartItems: this.state.cartItems.map((item) =>
          item.name === product.name && item.chars === product.chars
            ? { ...exist, qty: exist.qty + 1 }
            : item
        ),
      });
    }
  }

  onQtyDecrease(product) {
    const exist = this.state.cartItems.find(
      (item) => item.name === product.name && item.chars === product.chars
    );

    if (exist) {
      this.setState({
        cartItems: this.state.cartItems.map((item) =>
          item.name === product.name && item.chars === product.chars
            ? {
                ...exist,
                qty: exist.qty > 1 ? exist.qty - 1 : 1,
              }
            : item
        ),
      });
    }
  }

  onCartItemDelete(product) {
    this.setState({
      cartItems: this.state.cartItems.filter((item) => {
        return item.index !== product.index;
      }),
    });
  }


  render() {
    const data = this.props.dataValue;
    return (
      data ? (
        <Router>
          <Navbar
            setCategory={this.handleClick}
            category={this.state.category}
            setCurrency={this.handleCurrency}
            currency={this.state.currency}
            dataValue={data}
          />
  
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  category={this.state.category}
                  currency={this.state.currency}
                  dataValue={this.props.dataValue}
                  onAdd={this.onAdd}
                />
              }
            />
  
            <Route
              path="/cart"
              element={
                <Cart
                  cart={this.state.cartItems}
                  onAdd={this.onAdd}
                  currency={this.state.currency}
                  onQtyDecrease={this.onQtyDecrease}
                  onQtyIncrease={this.onQtyIncrease}
                  onCartItemDelete={this.onCartItemDelete}
                />
              }
            />
  
          {data.categories
            .filter((category) => category.name === "all")[0]
            .products.map((product, index) => {
              return (
                <Route
                  key={index}
                  path={"/products/" + product.id}
                  element={
                    <Product
                      id={product.id}
                      name={product.name}
                      brand={product.brand}
                      category={product.category}
                      attributes={product.attributes}
                      description={product.description}
                      gallery={product.gallery}
                      inStock={product.inStock}
                      currency={this.state.currency}
                      prices={product.prices}
                      cart={this.state.cartItems}
                      onAdd={this.onAdd}
                    />
                  }
                />
              );
            })}
  
          </Routes>
        </Router>
      )
      : <h1>Loading...</h1>
      );
    } 
  }

export default withQuery(App)