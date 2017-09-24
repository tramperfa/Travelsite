import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
//import IconButton from 'material-ui/IconButton';


import {
  Link
} from 'react-router-dom';

import persist from '../lib/persist';


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


  const classes = props.classes;
  // var loginSate = false;
  // if (localforage.getItem("me")) {
  //   loginSate = true;
  // }
//   var me;
// localforage.getItem("me")
// .then(function(value) {
//    me = value;
// })
//   console.log(me.fullName);

// {
//   me
//   ? <Button color="contrast">Hello, {me.fullName}</Button>
//   : <Link to="/login"><Button color="contrast">Login</Button></Link>
// }


  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.flex}>
            <Link to="/">
            Travel Site Building In process
            </Link>
          </Typography>
          <Link to="/login"><Button color="contrast">Login</Button></Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
