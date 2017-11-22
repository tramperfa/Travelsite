import React from 'react';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
import {withStyles} from 'material-ui/styles';
//

import DeleteStoryCard from '../../components/DeleteStoryCard';

const styles = theme => ({
  textField: {
    textDecoration: 'none'
  }
});

const StoryCount = (props) => {
  const number = props.number
  if (number === 0) {
    return (
      <div>
        No deleted story
      </div>
    )
  } else if (number === 1) {
    return (
      <div>
        Total 1 Deleted Story
      </div>
    )
  } else {
    return (
      <div>
        Total {number + '  '}
        Deleted Stories
      </div>
    )
  }
}

class MyStory extends React.Component {

  handleRecover = () => {
    console.log("TBD");
  }

  render() {

    if (this.props.myDeleteStoryData.loading) {
      return (
        <div>Loading</div>
      )
    }

    const stories = this.props.myDeleteStoryData.myDeletedStories

    return (
      <div>
        {stories.map(story => (
          <div className="storyList" key={story._id}>
            <DeleteStoryCard story={story} onClick={this.handleRecover}/>
          </div>
        ))}
        <div>
          <StoryCount number={stories.length}/>
        </div>
      </div>
    )
  }
}

MyStory.propTypes = {
  match: PropTypes.object.isRequired,
  myDeleteStoryData: PropTypes.object.isRequired
}

export const myDeleteStoryQuery = gql `
  query myDeleteStoryQuery {
    myDeletedStories {
      _id
      title
      snapshotContent
      # coverImage{
      #   _id
      #   browserStoryImage
      # }
      lastUpdate
      viewCount
      likeStoryCount
      archiveStoryCount
      commentCount
    }
  }
`;

export const withMyStoryData = graphql(myDeleteStoryQuery, {name: 'myDeleteStoryData'})

export default withMyStoryData(withStyles(styles)(MyStory))
