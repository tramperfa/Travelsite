import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Logout from './Logout';

function Me(props) {

  return (
    <div>
      {props.me.fullName
        ? <Logout me={props.me} onLogout={props.onLogout}/>
        : <Button onClick={this.handleClickOpen}>Login</Button>}
    </div>
  );

}

Me.propTypes = {
  me: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
}

export default Me;
