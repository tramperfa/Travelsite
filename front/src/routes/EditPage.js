import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
import Button from 'material-ui/Button';
import {Redirect} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import Dropzone from 'react-dropzone';
//import DraftDetailsQuery from './DraftQuery.graphql'

//
import ImageUpload from '../lib/ImageUpload';

import Editor from '../components/StoryEditor/Editor';
import {storiesListQuery} from './Homepage';
import HeadlineIamgeCrop from '../components/HeadlineImageCrop';

class Draft extends React.Component {
  state = {
    publishRedirect: false,
    linkedStoryID: undefined,
    errorMessage: null,
    cropOpen: false, // Control Headline Image Cropper Open/Close
    headlineImage: null, // Being Used as Headline Image
    theCropImage: {}, // Being Used as Crop Image
    title: ''
  }

  componentDidUpdate(prevProps) {
    if (this.props.draftData.draft && prevProps.draftData.draft !== this.props.draftData.draft) {
      this.setState({title: this.props.draftData.draft.title, headlineImage: this.props.draftData.draft.headlineImage})
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

  onDrop = async(files) => {
    try {} catch (e) {} finally {}
    const draftID = this.props.match.params._id
    let image = await ImageUpload(files[0], 1, draftID, 0)
    // Pass image to Dialog
    this.setState({cropOpen: true, theCropImage: image})
  }

  updateHeadlineImage = (newImage) => {
    this.setState({headlineImage: newImage})
  }

  handleCloseCropper = () => {
    this.setState({cropOpen: false});
  }

  handleOpenCropper = () => {
    this.setState({cropOpen: true});
  }

  render() {
    //console.log(this.props.draftData.draft);

    if (this.state.publishRedirect) {
      return <Redirect push to={`/story/${this.state.linkedStoryID}`}/>;
    }

    if (this.props.draftData.loading) {
      return (
        <div>Loading</div>
      )
    }

    return (
      <div>
        {this.state.theCropImage.originalImage && <HeadlineIamgeCrop cropOpen={this.state.cropOpen} handleCloseCropper={this.handleCloseCropper} theCropImage={this.state.theCropImage} updateHeadlineImage={this.updateHeadlineImage}/>}

        <div>
          {this.state.headlineImage
            ? <Headline headlineImage={this.state.headlineImage}/>
            : <Dropzone onDrop={this.onDrop} accept="image/jpeg, image/gif, image/png, image/tiff">
              <div>Click or Drop Story Headline Image --------- Suggest Use Original Image or Image Higher than 1980px
              </div>
            </Dropzone>}
        </div>

        <TextField inputProps={{
          maxLength: 60
        }} id="title" helperText={60 - this.state.title.length + " letters avaliable"} onBlur={this.handleTitleUpdate} fullWidth={true} placeholder="Title contains up to 60 letters" label="Title" value={this.state.title} onChange={this.handleChange('title')}/>

        <div>
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

const Headline = (props) => {
  var imageSource = 'https://s3.amazonaws.com/thetripbeyond/' + props.headlineImage.browserHeadlineImage.filename
  return (<img className="headlineImage" src={imageSource} alt='headline'/>)
}

export const DraftDetailsQuery = gql `
  query DraftQuery($draftID : ID!) {
    draft(draftID: $draftID) {
      _id
      title
      content
      author{
        _id
        fullName
      }
      headlineImage{
        browserHeadlineImage{
          filename
        }
      }
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
