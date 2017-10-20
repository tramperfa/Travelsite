import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
import IconButton from 'material-ui/IconButton';
import FavoriteBorder from "material-ui-icons/FavoriteBorder";
import StarBorder from "material-ui-icons/StarBorder";
import Favorite from "material-ui-icons/Favorite";
import Star from "material-ui-icons/Star";
import Comment from "material-ui-icons/Comment";
//import Reply from "material-ui-icons/Reply";
//import {createBrowserHistory} from 'history';
//const history = createBrowserHistory()

class Story extends React.Component {
  state = {
    publishRedirect: false,
    errorMessage: null,
    liked: false,
    archived: false
  }

  componentDidUpdate(prevProps) {
    //console.log(this.props);

    if (this.props.MeData.me && (prevProps.MeData.me !== this.props.MeData.me)) {
      // console.log("NEW BB");
      // console.log(this.props);
      if (this.props.MeData.me.like.indexOf(this.props.match.params._id) >= 0) {
        this.setState({liked: true})
      }
      if (this.props.MeData.me.archive.indexOf(this.props.match.params._id) >= 0) {
        this.setState({archived: true})
      }
    }
  }

  handleLike = () => {
    var storyID = this.props.match.params._id
    this.props.likeStory(storyID).then(() => {
      this.setState({liked: true})
    }).catch((e) => {
      if (e.graphQLErrors[0].message === "User Not Logged In") {
        //console.log("TRIGGER LOGIN");
        this.props.handleTriggerOpen()
      }
      this.setState({errorMessage: e.graphQLErrors[0].message})
    })
  }

  handleArchive = () => {
    var storyID = this.props.match.params._id
    this.props.archiveStory(storyID).then(() => {
      this.setState({archived: true})
    }).catch((e) => {
      if (e.graphQLErrors[0].message === "User Not Logged In") {
        //console.log("TRIGGER LOGIN");
        this.props.handleTriggerOpen()
      }
      this.setState({errorMessage: e.graphQLErrors[0].message})
    })
  }

  render() {
    //  console.log(this.props.MeData);
    const story = this.props.storyData.story;
    if (this.props.storyData.loading) {
      return (
        <div>Loading</div>
      )
    }

    return (

      <div>
        <div>
          <div>{"Tiltle: " + story.title}</div>
          <div>{"Author: " + story.author.fullName}</div>
          <div>{story.likeCount + "Likes"}</div>
          <div>{story.viewCount + "Views"}</div>
          <div>{story.archiveCount + "Archives"}</div>
          <div style={{
            color: 'red'
          }}>
            {this.state.errorMessage}
          </div>
          <div>
            {moment(new Date(story.lastUpdate)).utc().local().format("YYYY-MM-DD HH:mm")}
          </div>

        </div>
        <IconButton aria-label="Like" onClick={this.handleLike}>
          {this.state.liked
            ? <Favorite/>
            : <FavoriteBorder/>}

        </IconButton>
        <IconButton aria-label="Archive" onClick={this.handleArchive}>
          {this.state.archived
            ? <Star/>
            : <StarBorder/>}
        </IconButton>
        <IconButton aria-label="Comment">
          <Comment/>
        </IconButton>
      </div>
    )
  }
}

Story.propTypes = {
  likeStory: PropTypes.func.isRequired,
  archiveStory: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  storyData: PropTypes.object.isRequired,
  handleTriggerOpen: PropTypes.func.isRequired,
  MeData: PropTypes.object.isRequired
}

export const StoryDetailsQuery = gql `
  query StoryQuery($_id : ID!) {
    story(_id: $_id) {
      _id
      title
      author{
        fullName
      }
      content
      lastUpdate
      viewCount
      likeCount
      commentCount
      archiveCount
      # comments

    }
  }
`;

export const WithData = graphql(StoryDetailsQuery, {
  options: (props) => ({
    variables: {
      _id: props.match.params._id
    },

    notifyOnNetworkStatusChange: true
  }),
  name: 'storyData'
})

export const meQuery = gql `
  query meQuery {
    me {
      _id
      like
      archive
    }
  }
`;

export const WithMeData = graphql(meQuery, {
  options: {
    notifyOnNetworkStatusChange: true
  },
  name: 'MeData'
})

export const LikeStoryMutation = gql `
  mutation likeStory($storyID : ID!) {
    likeStory(storyID: $storyID) {
      _id
      likeCount
      lastUpdate
    }
  }
`;

export const WithLike = graphql(LikeStoryMutation, {
  props: ({mutate}) => ({
    likeStory: (storyID) => mutate({
      variables: {
        storyID: storyID
      }
    })
  })
})

export const ArchiveStoryMutation = gql `
  mutation archiveStory($storyID : ID!) {
    archiveStory(storyID: $storyID) {
      _id
      archiveCount
      lastUpdate
    }
  }
`;

export const WithArchive = graphql(ArchiveStoryMutation, {
  props: ({mutate}) => ({
    archiveStory: (storyID) => mutate({
      variables: {
        storyID: storyID
      }
    })
  })
})

export default WithArchive(WithLike(WithData(WithMeData(Story))))
