import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'

class Layout extends Component {
  state = {
    showSideDrawer: false
  }

  sidebarClosedHandler = () => (
    this.setState({showSideDrawer: false})
  );

  render() {
    return (
      <Aux>
        <Toolbar />
        <SideDrawer 
          open={this.state.showSideDrawer}
          closed={this.sidebarClosedHandler}/>
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Aux>
    )
  }
};
export default Layout;