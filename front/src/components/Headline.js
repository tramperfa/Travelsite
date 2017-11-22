import React, {Component} from 'react';
import PropTypes from 'prop-types';
//import {gql, graphql} from 'react-apollo';
import Button from 'material-ui/Button';

class Headline extends Component {

  state = {}

  render() {
    return (
      <div>

        <Button raised color="primary" onClick={this.handleCrop}>
          Submit
        </Button>
        <Button raised color="primary">
          Cancel
        </Button>
      </div>
    );
  }
}

Headline.propTypes = {
  //cropImage: PropTypes.func.isRequired

}

export default Headline
