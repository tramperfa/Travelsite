import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import {NavLink} from 'react-router-dom';

// import IconButton from 'material-ui/IconButton';
//import Drafts from "material-ui-icons/Drafts";

import Me from './Me';
import AllLogin from './AllLogin';

const styles = theme => ({
  root: {
    //marginTop: theme.spacing.unit * 3,
    width: '100%'
  },
  appbar: {
    height: '44px',
    backgroundColor: '#333333'
  },
  toolbar: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: '44px',
    backgroundColor: '#333333'
  },
  navsection: {
    flex: 'auto',
    justifyContent: 'flex-start'
  },
  login: {
    flex: 'none',
    justifyContent: 'flex-end'
  }
});

function ButtonAppBar(props) {

  return (
    <div className={props.classes.root}>
      <AppBar position="static" className={props.classes.appbar}>
        <Toolbar className={props.classes.toolbar}>
          <div className={props.classes.navsection}>

            <NavLink to="/" exact activeClassName="active">
              <Button color="contrast">Home</Button>
            </NavLink>
            <NavLink to="/dest" exact activeClassName="active">
              <Button color="contrast">Destination</Button>
            </NavLink>
            <NavLink to="/hotel" exact activeClassName="active">
              <Button color="contrast">Hotel</Button>
            </NavLink>

          </div>
          <div className={props.classes.login}>
            {!props.me.Looooooooading && (props.me.fullName
              ? <Me client={props.client} me={props.me} onLogout={props.onLogout}/>
              : <AllLogin handleClickOpen={props.handleClickOpen}/>)}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

//  : <Button className="login" color="contrast" onClick={props.handleClickOpen}>Login</Button>)}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
