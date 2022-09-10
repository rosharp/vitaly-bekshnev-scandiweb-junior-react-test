import React, { Component } from 'react'
import Products from './Products'
import { ProductsContext } from './ProductsContext';

export default class Home extends Component {
    render() {
        return (
            <div>
                <h1>{this.props.category}</h1>
                <Products category={this.props.category} currency={this.props.currency} />
            </div>
        )
    }
}
