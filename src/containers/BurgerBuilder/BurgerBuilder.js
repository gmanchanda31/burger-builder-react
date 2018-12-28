import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  
  state = {
      ingredients: {
          salad: 0,
          bacon: 0,
          cheese: 0,
          meat: 0
      }, 
      totalPrice: 4,
      purchasable: false,
      purchasing: false
  }

  purchaseHandler = () => {
    this.setState({
      purchasing: true
    });
  }

  purchaseCancelHandler = () => {
    //this will execute when backdrop will be clicked.
    console.log("purchased cancelled");
    this.setState({ purchasing: false });
  }

  purchaseContinueHandler = () => {
    console.log("purchased continued");
    alert('You Continue!');
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igkey => {
        return ingredients[igkey]
      })
      .reduce((sum, el) => {
        return sum + el
      }, 0);
      this.setState({ purchasable: sum > 0 });
  }

  addIngredientHandler = (type) => {
    console.log('add ingredient handler is called')
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    // state should be updated in an immutable way
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({
      totalPrice: newPrice, 
      ingredients: updatedIngredients
    })
    this.updatePurchaseState(updatedIngredients)
  }

  removeIngredientHandler = (type) => {
    console.log('remove ingredient handler is called')
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0){
      return;
    }
    const updatedCount = oldCount - 1;
    // state should be updated in an immutable way
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    });
    this.updatePurchaseState(updatedIngredients);
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    }
    for (let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    return <Aux>
      <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
        <OrderSummary 
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} />
      </Modal>
      <Burger ingredients={this.state.ingredients} />
      <BuildControls 
        ingredientAdded={this.addIngredientHandler} 
        ingredientRemoved={this.removeIngredientHandler} 
        disabled={disabledInfo} price={this.state.totalPrice} 
        purchasable={this.state.purchasable}
        ordered={this.purchaseHandler} />
      </Aux>;
  }
}

export default BurgerBuilder;
