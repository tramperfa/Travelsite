import React from 'react'
//import {Link} from 'react-router-dom'
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

//
import DraftList, {draftsListQuery} from '../components/DraftList';

class UserDraft extends React.Component {
  state = {
    newDraftID: null
  }

  handleCreate = async () => {
    this.props.createDraft().then((data) => {
      //console.log(JSON.stringify(data));
      this.setState({newDraftID: data.data.createDraft._id})
    })
  }

  render() {
    if (this.state.newDraftID) {
      return <Redirect push={true} to={`/edit/${this.state.newDraftID}`}/>;
    }

    return (
      <div>
        <DraftList/>
        <Button raised="raised" color="primary" onClick={this.handleCreate}>
          CREATE NEW DRAFT
        </Button>
      </div>
    )
  }

}

UserDraft.propTypes = {
  createDraft: PropTypes.func.isRequired
}

const createDraftMutation = gql `
  mutation createDraft($ID: ID){
    createDraft(userID: $ID) {
      _id
      title
  }
}
`;

export default graphql(createDraftMutation, {
  props: ({mutate}) => ({
    createDraft: () => mutate({
      refetchQueries: [
        {
          query: draftsListQuery
        }
      ]
    })
  })
})(UserDraft)
