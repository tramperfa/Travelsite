import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';

// import IconButton from 'material-ui/IconButton';
//import Drafts from "material-ui-icons/Drafts";

import Me from './Me';

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

// {(props.Nav === 'Destination')
//   ? <Button color="primary" onClick={() => props.handleNav('Destination')}>Destination</Button>
//   : <Button color="contrast" onClick={() => props.handleNav('Destination')}>Destination</Button>}
// {(props.Nav === 'Hotel')
//   ? <Button color="primary" href="/hotel" onClick={() => props.handleNav('Hotel')}>Hotel</Button>
//   : <Button color="contrast" href="/hotel" onClick={() => props.handleNav('Hotel')}>Hotel</Button>}

function ButtonAppBar(props) {

  return (
    <div className={props.classes.root}>
      <AppBar position="static" className={props.classes.appbar}>
        <Toolbar className={props.classes.toolbar}>
          <div className={props.classes.navsection}>
            {(props.Nav === 'Home')
              ? <Link to="/">
                  <Button color="primary" onClick={() => props.handleNav('Home')}>Home</Button>
                </Link>
              : <Link to="/">
                <Button color="contrast" onClick={() => props.handleNav('Home')}>Home</Button>
              </Link>}
            {(props.Nav === 'Destination')
              ? <Link to="/dest">
                  <Button color="primary" onClick={() => props.handleNav('Destination')}>Destination</Button>
                </Link>
              : <Link to="/dest">
                <Button color="contrast" onClick={() => props.handleNav('Destination')}>Destination</Button>
              </Link>}
            {(props.Nav === 'Hotel')
              ? <Link to="/hotel">
                  <Button color="primary" onClick={() => props.handleNav('Hotel')}>Hotel</Button>
                </Link>
              : <Link to="/hotel">
                <Button color="contrast" onClick={() => props.handleNav('Hotel')}>Hotel</Button>
              </Link>}

          </div>
          <div className={props.classes.login}>
            {!props.me.Looooooooading && (props.me.fullName
              ? <Me client={props.client} me={props.me} onLogout={props.onLogout}/>
              : <Button className="login" color="contrast" onClick={props.handleClickOpen}>Login</Button>)}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  Nav: PropTypes.string.isRequired,
  handleNav: PropTypes.func.isRequired
};

export default withStyles(styles)(ButtonAppBar);
