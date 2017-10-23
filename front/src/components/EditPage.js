import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
import Button from 'material-ui/Button';
import {Redirect} from 'react-router-dom';
import TextField from 'material-ui/TextField';
//import StoryDetailsQuery from './StoryQuery.graphql'

import HeadlineUpload from './HeadlineUpload';
import Editor from './StoryEditor/Editor';
//import Editor from './Editor';

class Draft extends React.Component {
  state = {
    publishRedirect: false,
    errorMessage: null,
    title: ''
  }

  componentDidUpdate(prevProps) {
    if (this.props.draftData.story && prevProps.draftData.story !== this.props.draftData.story) {
      this.setState({title: this.props.draftData.story.title})
    }
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

  handleChange = name => event => {
    this.setState({[name]: event.target.value});
  }

  handleTitleUpdate = () => {
    //console.log("TRIGGER");
    try {
      this.props.updateTitle(this.props.match.params._id, this.state.title)
    } catch (e) {
      this.setState({errorMessage: e.graphQLErrors[0].message})
    } finally {}

  }

  render() {
    //console.log(this.props.match.params._id);

    if (this.state.publishRedirect) {
      return <Redirect push to={`/story/${this.props.match.params._id}`}/>;
    }

    if (this.props.draftData.loading) {
      return (
        <div>Loading</div>
      )
    }

    return (
      <div>
        <HeadlineUpload/>
        <TextField inputProps={{
          maxLength: 60
        }} id="title" helperText={60 - this.state.title.length + " letters avaliable"} onBlur={this.handleTitleUpdate} fullWidth={true} placeholder="Title contains up to 60 letters" label="Title" value={this.state.title} onChange={this.handleChange('title')}/>

        <div>
          {/* <div>{"Tiltle: " + this.props.draftData.story.title}</div>
          <div>{"Author: " + this.props.draftData.story.author.fullName}</div> */}
          <div>
            {moment(new Date(this.props.draftData.story.lastUpdate)).utc().local().format("YYYY-MM-DD HH:mm")}
          </div>
        </div>
        <div>
          <Editor startingContent={this.props.draftData.story.content} match={this.props.match}/>
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
  updateTitle: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  draftData: PropTypes.object.isRequired
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
      _id
    }
  }
`;

export const UpdateTitleMutation = gql `
mutation updateTitle($input: updateTitleInput!) {
  updateTitle(input: $input) {
      _id
      title
    }
  }
`;

export const WithDraftData = graphql(StoryDetailsQuery, {
  options: (props) => ({
    variables: {
      _id: props.match.params._id
    }
  }),
  name: 'draftData'
})

export const WithPublish = graphql(PublishStoryMutation, {
  props: ({mutate}) => ({
    publishStory: (storyID) => mutate({
      variables: {
        storyID: storyID
      }
    })
  })
})

export const WithTitleMuation = graphql(UpdateTitleMutation, {
  props: ({mutate}) => ({
    updateTitle: (storyID, newTitle) => mutate({
      variables: {
        input: {
          storyID: storyID,
          newTitle: newTitle
        }
      }
    })
  })
})

export default WithTitleMuation((WithPublish(WithDraftData(Draft))))
