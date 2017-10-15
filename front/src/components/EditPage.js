import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
import Button from 'material-ui/Button';
import {Redirect} from 'react-router-dom';

//import Editor from './Editor';

class Draft extends React.Component {
  state = {
    publishRedirect: false,
    errorMessage: null
  }

  handlePublish = () => {
    try {
      var storyID = this.props.match.params._id
      this.props.publishStory(storyID).then(() => {
        this.setState({publishRedirect: true})
      })
    } catch (e) {
      this.setState({errorMessage: e.graphQLErrors[0].message})
    } finally {}

  }

  render() {
    //console.log(this.props.match.params._id);
    if (this.state.publishRedirect) {
      return <Redirect push to={`/story/${this.props.match.params._id}`}/>;
    }

    if (this.props.data.loading) {
      return (
        <div>Loading</div>
      )
    }

    return (
      <div>
        <div>
          <div>{"Tiltle: " + this.props.data.story.title}</div>
          <div>{"Author: " + this.props.data.story.author.fullName}</div>
          <div>
            {moment(new Date(this.props.data.story.lastUpdate)).utc().local().format("YYYY-MM-DD HH:mm")}
          </div>
        </div>
        <Button raised color="primary" onClick={this.handlePublish}>
          Publish Travel Story
        </Button>
      </div>
    )
  }
}

Draft.propTypes = {
  publishStory: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export const StoryDetailsQuery = gql `
  query StoryDraftQuery($_id : ID!) {
    story(_id: $_id) {
      _id
      title
      author{
        fullName
      }
      lastUpdate
      viewCount
      commentCount
      likeCount
      content
    }
  }
`;

export const PublishStoryMutation = gql `
  mutation publishStory($storyID : ID!) {
    publishStory(storyID: $storyID) {
      hidden
    }
  }
`;

const DraftWithData = (graphql(StoryDetailsQuery, {
  options: (props) => ({
    variables: {
      _id: props.match.params._id
    }
  })
})(Draft));

export default(graphql(PublishStoryMutation, {
  props: ({mutate}) => ({
    publishStory: (storyID) => mutate({
      variables: {
        storyID: storyID
      }
    })
  })
})(DraftWithData))
