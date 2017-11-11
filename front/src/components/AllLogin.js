import React from 'react';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';

export default function AllLogin(props) {

  return (
    <div>
      <Button className="login" color="contrast" onClick={props.handleClickOpen}>Login</Button>
      <Link to="/signup">
        <Button className="signup" color="contrast">Signup</Button>
      </Link>
    </div>

  )
}
