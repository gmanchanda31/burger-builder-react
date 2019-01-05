import React, {Component} from 'react';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

class Checkout extends Component {
    state = {
        ingredients: {
            salad: 1,
            cheese: 1,
            meat: 1,
            bacon: 1
        }
    }

    checkoutCancelledHandler = () => {
        console.log(this.props);
        // since we are rendering checkout component with 
        // a route so we have some special props available
        // and history is one of those special props.
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        // since we are rendering checkout component with 
        // a route so we have some special props available
        // and history is one of those special props.
        this.props.history.replace('/checkout/contact-data')
    }

    render() {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler} />
            </div>
        );
    }
}

export default Checkout;