import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
import Button from 'material-ui/Button';
import {Redirect} from 'react-router-dom';
import TextField from 'material-ui/TextField';
//import DraftDetailsQuery from './DraftQuery.graphql'

import TempUpload from './TempUpload';
import Editor from './StoryEditor/Editor';
import {storiesListQuery} from './Homepage';
// import ReactCrop, {makeAspectCrop} from 'react-image-crop';
// import imageC from '../images/z.jpg';

//import Editor from './Editor';

// var crop = {
//   aspect: 3 / 1
// }

class Draft extends React.Component {
  state = {
    publishRedirect: false,
    linkedStoryID: undefined,
    errorMessage: null,
    headlineImage: null,
    title: ''
  }

  componentDidUpdate(prevProps) {
    if (this.props.draftData.draft && prevProps.draftData.draft !== this.props.draftData.draft) {
      this.setState({title: this.props.draftData.draft.title})
    }
  }

  handlePublish = async() => {
    try {
      var draftID = this.props.match.params._id
      var data = await this.props.publishDraft(draftID)
      this.setState({publishRedirect: true, linkedStoryID: data.data.publishDraft.story})
    } catch (e) {
      this.setState({errorMessage: e.graphQLErrors[0].message})
    } finally {}
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value});
  }

  handleTitleUpdate = () => {
    try {
      this.props.updateTitle(this.props.match.params._id, this.state.title)
    } catch (e) {
      this.setState({errorMessage: e.graphQLErrors[0].message})
    } finally {}

  }

  render() {

    if (this.state.publishRedirect) {
      //console.log(this.props.draftData.draft.story);
      return <Redirect push to={`/story/${this.state.linkedStoryID}`}/>;
    }

    if (this.props.draftData.loading) {
      return (
        <div>Loading</div>
      )
    }

    return (
      <div>
        {/* <div>
          {this.state.headlineImage? }
        </div> */}

        <TempUpload match={this.props.match}/>
        <TextField inputProps={{
          maxLength: 60
        }} id="title" helperText={60 - this.state.title.length + " letters avaliable"} onBlur={this.handleTitleUpdate} fullWidth={true} placeholder="Title contains up to 60 letters" label="Title" value={this.state.title} onChange={this.handleChange('title')}/>

        <div>
          {/* <div>{"Tiltle: " + this.props.draftData.draft.title}</div>
          <div>{"Author: " + this.props.draftData.draft.author.fullName}</div> */}
          <div>
            {moment(new Date(this.props.draftData.draft.lastUpdate)).utc().local().format("YYYY-MM-DD HH:mm")}
          </div>
        </div>
        <div>
          <Editor startingContent={this.props.draftData.draft.content} match={this.props.match}/>
        </div>
        <Button raised color="primary" onClick={this.handlePublish}>
          Publish Travel Draft
        </Button>
      </div>
    )
  }
}

Draft.propTypes = {
  publishDraft: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  draftData: PropTypes.object.isRequired
}

export const DraftDetailsQuery = gql `
  query DraftQuery($draftID : ID!) {
    draft(draftID: $draftID) {
      _id
      title
      # DO NOT ADD AUTHOR, FILED NOT POPULATED FOR DRAFT
      # author{
      #   _id
      #   fullName
      # }
      lastUpdate
      content
    }
  }
`;

export const PublishDraftMutation = gql `
  mutation publishDraft($draftID : ID!) {
    publishDraft(draftID: $draftID) {
      _id
      story
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

export const WithDraftData = graphql(DraftDetailsQuery, {
  options: (props) => ({
    variables: {
      draftID: props.match.params._id
    }
  }),
  name: 'draftData'
})

export const WithPublish = graphql(PublishDraftMutation, {
  props: ({mutate}) => ({
    publishDraft: (draftID) => mutate({
      variables: {
        draftID: draftID
      },
      refetchQueries: [
        {
          query: storiesListQuery
        }
      ]
    })
  })
})

export const WithTitleMuation = graphql(UpdateTitleMutation, {
  props: ({mutate}) => ({
    updateTitle: (draftID, newTitle) => mutate({
      variables: {
        input: {
          draftID: draftID,
          newTitle: newTitle
        }
      }
    })
  })
})

export default WithTitleMuation((WithPublish(WithDraftData(Draft))))
