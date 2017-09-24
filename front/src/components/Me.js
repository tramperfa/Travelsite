import React from 'react';
//import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {
  Link
} from 'react-router-dom';

import persist from '../lib/persist';



class Me extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      me: null,
      loggedIn: false
    }


  }

  componentDidMount() {
    persist.willGetSessionUser().then(function(value) {
      this.setState({
        me: value,
        loggedIn: (value != null)
      })
    }.bind(this))
  }


  render() {
    return (
      <div>
        {
          this.state.loggedIn
          ? <Button color="contrast">Hello, {this.state.me.fullName}</Button>
          : <Link to="/login"><Button color="contrast">Login</Button></Link>
        }
      </div>
    );
  }
}

export default Me;
