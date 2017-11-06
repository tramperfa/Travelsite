import React from 'react';
//import moment from 'moment';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
import {withStyles} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Tabs, {Tab} from 'material-ui/Tabs';
import MyStoryCard from './MyStoryCard';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 3
  }
});

const TabContainer = (props) => {
  return <div style={{
    padding: 2 * 2
  }}>{props.children}</div>;
}

const Home = (props) => {
  const user = props.user
  return (
    <div>
      <div>
        <div>{"FullName: " + user.fullName}</div>
        <div>{"Username: " + user.username}</div>
        <div>{user._id}</div>
        <div>{user.provider}</div>
      </div>
    </div>
  )
}

const StoryCount = (props) => {
  const number = props.number

  if (number === 0) {
    return (
      <div>
        A Story is Missing Here
      </div>
    )
  } else if (number === 1) {
    return (
      <div>
        Total 1 Story
      </div>
    )
  } else {
    return (
      <div>
        Total {number + '  '}
        Stories
      </div>
    )
  }

}

const Story = (props) => {
  const stories = props.stories
  //console.log(stories);
  return (
    <div>
      {stories.map(story => (
        <div className="storyList" key={story._id}>
          <MyStoryCard story={story}/>
        </div>
      ))}
      <div>
        {< Button raised color = "primary" href = "#delete" > My Deleted Stories < /Button>}
      </div>
      <div>
        <StoryCount number={stories.length}/>
      </div>
    </div>
  )
}

class UserHomePage extends React.Component {

  constructor(props) {
    super(props)
    // console.log("CONSTRUCTOR CALLED");
    // console.log(props.match);
    this.state = {
      value: props.match.params.n
    }
  }

  componentDidUpdate(prevProps) {
    //console.log(this.props)

    if (this.props.match.params.n && (prevProps.match.params.n !== this.props.match.params.n)) {
      this.setState({value: this.props.match.params.n})

    }
  }

  // handleChange = (event, value) => {
  //   // this.setState({value});
  // };

  render() {
    console.log("UserHome Rendering");
    //const user = this.props.userData.user
    const {classes} = this.props;
    if (this.props.userData.loading || this.props.myStoryData.loading) {
      return (
        <div>Loading</div>
      )
    }

    return (

      <div>
        <Paper className={classes.root}>
          <Tabs value={this.state.value} indicatorColor="primary" textColor="primary" centered>
            <Tab label="My Home" href={`/user/${this.props.match.params._id}/0`}/>
            <Tab label="My Story" href={`/user/${this.props.match.params._id}/1`}/>
            <Tab label="My Archive" href={`/user/${this.props.match.params._id}/2`}/>
            <Tab label="My Review" href={`/user/${this.props.match.params._id}/3`}/>
            <Tab label="More" href={`/user/${this.props.match.params._id}/4`}/>
          </Tabs>
        </Paper>
        <div>
          {this.state.value === '0' && <Home user={this.props.userData.user}/>}
          {this.state.value === '1' && <TabContainer>
            <Story stories={this.props.myStoryData.myStories}/>
          </TabContainer>}
          {this.state.value === '2' && <TabContainer>TBD: My Reviews</TabContainer>}
        </div>
      </div>

    )

  }

}

UserHomePage.propTypes = {
  match: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  myStoryData: PropTypes.object.isRequired
}

export const userDetailQuery = gql `
  query userDetailsQuery($_id : ID!) {
    user(_id: $_id) {
      _id
      fullName
      username
      provider
      profile
    }
  }
`;

export const withUserData = graphql(userDetailQuery, {
  options: (props) => ({
    variables: {
      _id: props.match.params._id
    }
  }),
  name: 'userData'
})

export const myStoryQuery = gql `
  query myStoryQuery {
    myStories {
      _id
      title
      snapshotContent
      coverImage{
        _id
        browserStoryImage
      }
      lastUpdate
      viewCount
      likeStoryCount
      archiveStoryCount
      commentCount
    }
  }
`;

export const withMyStoryData = graphql(myStoryQuery, {name: 'myStoryData'})

const withStyle = withStyles(styles)

export default withMyStoryData(withUserData(withStyle(UserHomePage)))

// if (error) {
//   return <p>{error.graphQLErrors[0].message}</p>;
// }
