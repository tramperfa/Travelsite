import React from 'react';
import {withStyles} from 'material-ui/styles';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
//import Paper from 'material-ui/Paper';

import MyHome from './MyHome';
import MyStory from './MyStory';
import MyDeleteStory from './MyDeleteStory';
import UserHeader from './UserHeader';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 3
  }
});

const Placeholder = () => (
  <div>
    Place Holder for Review/Archive
  </div>
)

const DeletePlaceholder = () => (
  <div>
    Delete Place Holder
  </div>
)

class UserHome extends React.Component {

  render() {
    const {classes, match} = this.props;
    //console.log(match);
    return (
      <div>
        <UserHeader match={match}/>
        <Switch>
          <Route path={`${match.path}`} exact component={MyHome}/>
          <Route path={`${match.path}/story`} exact component={MyStory}/>
          <Route path={`${match.path}/review`} component={Placeholder}/>
          <Route path={`${match.path}/archive`} component={Placeholder}/>
          <Route path={`${match.path}/story/delete`} component={MyDeleteStory}/>
        </Switch>
      </div>
    )
  }

}

UserHome.propTypes = {
  match: PropTypes.object.isRequired
}

export default withStyles(styles)(UserHome)
