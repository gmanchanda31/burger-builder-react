import React, {Component} from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        }
    }

    orderHandler = (event) => {
        event.preventDefault();
        console.log('order handler called' + this.props.ingredients);
        this.setState({ loading: true });
        const order = {
            ingredients: this.props.ingredients,
            totalPrice: this.props.price,
            customer: {
                name: 'Gourav',
                address: {
                    street: 'sector 40b',
                    zipcode: '160014'
                },
                email: 'test@test.com',
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                console.log(response);
                this.setState({ loading: false });
                this.props.history.push('/')
            })
            .catch(error => {
                console.log(error);
                this.setState({ loading: false });
            });   
    }

    render() {
        let form = (<form>
            <input className={classes.Input} type="text" name="name" placeholder="Your name" />
            <input className={classes.Input} type="email" name="email" placeholder="Your email" />
            <input className={classes.Input} type="text" name="street" placeholder="Street name" />
            <input className={classes.Input} type="text" name="postal" placeholder="Postal code" />
            <Button btnType='Success' clicked={this.orderHandler}> ORDER NOW </Button>
        </form>);

        if(this.state.loading) {
            form = <Spinner />
        }

        return <div className={classes.ContactData} > 
            <h4>Enter your contact data.</h4>
            {form}
          </div>;
    }
}

export default ContactData;