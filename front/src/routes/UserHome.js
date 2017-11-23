import React from 'react';
import {withStyles} from 'material-ui/styles';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
//import Paper from 'material-ui/Paper';

import MyHome from './userHome/MyHome';
import MyStory from './userHome/MyStory';
import MyDeleteStory from './userHome/MyDeleteStory';
import UserHeader from '../components/Navigation/UserHeader';

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

class UserHome extends React.Component {

  render() {
    const {match} = this.props;
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
