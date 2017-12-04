import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import {withStyles} from 'material-ui/styles';
import Card, {CardContent, CardMedia} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Undo from "material-ui-icons/Undo";

import {RecoverStoryMutation} from '../graphql/story';
import {myDeleteStoryQuery} from '../graphql/story';

import imageTest from '../images/g.jpeg';

const styles = theme => ({
  card: {
    display: 'flex',
    marginTop: 24,
    width: 640,
    height: 300
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: 440,
    height: 300
  },
  textField: {
    textDecoration: 'none'
  }
});

function StoryCard(props) {
  const {classes, story} = props;

  const handleRecover = () => {
    props.recoverStory(story._id)
    console.log("TBD Recover");
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardMedia className={classes.cover} image={imageTest}/>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography type="headline">
              {story.title}
            </Typography>
            <div>{story.viewCount}
              Views
            </div>
            <div>
              {story.likeStoryCount}
              Likes
            </div>
            <IconButton aria-label="Undo" onClick={handleRecover}>
              Recovery Story
              <Undo/>
            </IconButton>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

StoryCard.propTypes = {
  classes: PropTypes.object.isRequired,
  //theme: PropTypes.object.isRequired,
  recoverStory: PropTypes.func.isRequired,
  story: PropTypes.object.isRequired
};

//NO REFETCH NEEDED
export const WithRecover = graphql(RecoverStoryMutation, {
  props: ({mutate}) => ({
    recoverStory: (storyID) => mutate({
      variables: {
        storyID: storyID
      },
      refetchQueries: [
        {
          query: myDeleteStoryQuery
        }
      ]
    })
  })
})

export default WithRecover(withStyles(styles, {withTheme: true})(StoryCard))
