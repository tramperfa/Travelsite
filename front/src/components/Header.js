import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
//import Button from 'material-ui/Button';
import {
  Link
} from 'react-router-dom';

import Me from './Me';
//var Me = require("./Me");

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
  flex: {
    flex: 1,
  },

});




function ButtonAppBar(props) {

  return (
    <div className={props.classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography type="title" color="inherit" className={props.classes.flex}>
            <Link to="/">
            Travel Site Building In process
            </Link>
          </Typography>
        <Me me = {props.me} onLogout={props.onLogout}/>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default withStyles(styles)(ButtonAppBar);
