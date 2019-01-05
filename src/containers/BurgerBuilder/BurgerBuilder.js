import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}
class BurgerBuilder extends Component {
  
  state = {
      ingredients: null, 
      totalPrice: 4,
      purchasable: false,
      purchasing: false,
      loading: false,
      error: false
  }

  componentDidMount() {
    axios.get("https://react-my-burger-4d471.firebaseio.com/ingredients.json")
      .then(response => {
        console.log(response);
        this.setState({ingredients: response.data});
      })
      .catch(error => {
        this.setState({ error: true});
      });
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
    // alert('You Continue!');
    // this.setState({ loading: true });
    // const order = {
    //   ingredients: this.state.ingredients,
    //   totalPrice: this.state.totalPrice,
    //   customer: {
    //     name: 'Gourav',
    //     address: {
    //       street: 'sector 40b',
    //       zipcode: '160014'
    //     },
    //   email: 'test@test.com',
    //   },
    //   deliveryMethod: 'fastest'
    // }
    // axios.post('/orders.json', order)
    //   .then(response => {
    //     console.log(response);
    //     this.setState({ loading: false, purchasing: false });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     this.setState({ loading: false, purchasing: false });
    //   });
    this.props.history.push('/checkout')
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

    let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
    let orderSummary = null;

    if(this.state.ingredients) {
      burger = <Aux>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo} price={this.state.totalPrice}
          purchasable={this.state.purchasable}
          ordered={this.purchaseHandler} />
      </Aux>

      orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} />
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return <Aux>
      <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
        {orderSummary}
      </Modal>
      {burger}
      </Aux>;
  }
}

export default withErrorHandler(BurgerBuilder, axios);
