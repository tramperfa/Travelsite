import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Logout from './Logout';
import Menu, {MenuItem} from 'material-ui/Menu';
import {withStyles} from 'material-ui/styles';

const styles = theme => ({
  textField: {
    textDecoration: 'none'
  }
});

class Me extends React.Component {
  state = {
    anchorEl: null,
    open: false
  };

  handleClick = event => {
    this.setState({open: true, anchorEl: event.currentTarget});
  };

  handleRequestClose = () => {
    this.setState({open: false});
  };

  handleRedirect = () => {
    this.setState({redirect: true});
  };

  render() {
    return (
      <div>
        <Button aria-owns={this.state.open
          ? 'simple-menu'
          : null} aria-haspopup="true" onClick={this.handleClick} color="contrast">
          {this.props.me.fullName}
        </Button>
        <Menu id="simple-menu" anchorEl={this.state.anchorEl} open={this.state.open} onRequestClose={this.handleRequestClose}>
          <MenuItem onClick={this.handleRequestClose}>
            <Link className={this.props.classes.textField} to={`/user/${this.props.me._id}`}>
              My Profile
            </Link>
          </MenuItem>
          <MenuItem onClick={this.handleRequestClose}>
            <Link className={this.props.classes.textField} to={`/userdraft/${this.props.me._id}`}>
              Write a Story
            </Link>
          </MenuItem>
          <Link className={this.props.classes.textField} to="/">
            <Logout onLogout={this.props.onLogout} handleRedirect={this.handleRedirect}/>
          </Link>
        </Menu>
      </div>
    );
  }
}

Me.propTypes = {
  me: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
}

export default withStyles(styles)(Me);
