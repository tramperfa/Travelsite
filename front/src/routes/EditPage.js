import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
import Button from 'material-ui/Button';
import {Redirect} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Edit from "material-ui-icons/Edit";

import Dropzone from 'react-dropzone';
//import DraftDetailsQuery from './DraftQuery.graphql'

//
import willUploadImage from '../lib/ImageUpload';

import Editor from '../components/StoryEditor/Editor';
import {storiesListQuery} from './Homepage';
import HeadlineIamgeCrop from '../components/HeadlineImageCrop';
import ImageInsert from '../components/StoryEditor/ImageInsert';
import willExtractOrientation from '../components/StoryEditor/util/ExtractOrientation';
import willExtractSize from '../components/StoryEditor//util/ExtractSize';

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
    const draftID = this.props.match.params._id
    let image = await willUploadImage(files[0], 1, draftID, 0)
    // Pass image to Dialog
    this.setState({cropOpen: true, theCropImage: image})
  }

  // Upload Crop Image
  uploadFile = async(file) => {
    try {
      // {orientation: 8, src: <localURL>}
      let localImageData = await willExtractOrientation(file)
      // example imageSize
      // {width: 100, height: 100}
      let imageSize = await willExtractSize(localImageData)
      let draftID = this.props.match.params._id
      let image = await willUploadImage(file, 0, draftID, imageSize.width, imageSize.height)
      this.setState({cropOpen: true, theCropImage: image})
    } catch (e) {
      console.log("Headline Image Upload Error: " + e);
    } finally {}
  }

  updateHeadlineImage = (newImage) => {
    this.setState({headlineImage: newImage})
  }

  handleCloseCropper = () => {
    this.setState({cropOpen: false});
  }

  handleOpenCropper = () => {
    console.log("AAA CALLED");
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
            ? <Headline headlineImage={this.state.headlineImage} uploadFile={this.uploadFile} handleOpenCropper={this.handleOpenCropper}/>
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

  return (
    <div>
      <img className="headlineImage" src={imageSource} alt='headline'/>
      <div>

        <ImageInsert uploadFile={props.uploadFile} comment='Re-Upload Headline Image'/>
      </div>
      <div>
        Re-Edit Headline Image
        <IconButton aria-label="Edit" onClick={props.handleOpenCropper}>
          <Edit/>
        </IconButton>
      </div>

    </div>
  )
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
