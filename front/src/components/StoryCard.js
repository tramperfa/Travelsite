import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {withStyles} from 'material-ui/styles';
import Card, {CardContent, CardMedia} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';

import FavoriteBorder from "material-ui-icons/FavoriteBorder";
import StarBorder from "material-ui-icons/StarBorder";
import Share from "material-ui-icons/Share";
//import Reply from "material-ui-icons/Reply";
import Comment from "material-ui-icons/Comment"

import imageTest from '../images/cardtest.jpeg';

const styles = theme => ({
  card: {
    display: 'flex',
    marginTop: 24,
    width: 520,
    height: 150
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: 220,
    height: 150
  },
  textField: {
    textDecoration: 'none'
  }
});

function StoryCard(props) {
  const {classes, story} = props;

  return (
    <div>
      <Card className={classes.card}>
        <Link className={classes.textField} to={`story/${story._id}`}>
          <CardMedia className={classes.cover} image={imageTest} title="Live from space album cover"/>
        </Link>
        <div className={classes.details} href={`story/${story._id}`}>
          <Link className={classes.textField} to={`story/${story._id}`}>
            <CardContent className={classes.content}>
              <Typography type="headline">
                {story.title}
              </Typography>
              <Typography type="subheading" color="secondary">
                {story.author.fullName}
              </Typography>
              <div>{story.viewCount}
                Views {story.likeCount}
                Likes</div>
            </CardContent>
          </Link>
          <div className={classes.controls}>
            <IconButton aria-label="Like">
              <FavoriteBorder/>
            </IconButton>
            <IconButton aria-label="Archive">
              <StarBorder/>
            </IconButton>
            <IconButton aria-label="Share">
              <Share/>
            </IconButton>
            {/* <IconButton aria-label="Reply">
              <Reply/>
            </IconButton> */}
            <IconButton aria-label="Comment">
              <Comment/>
            </IconButton>
          </div>
        </div>

      </Card>
    </div>
  );
}

StoryCard.propTypes = {
  classes: PropTypes.object.isRequired,
  //theme: PropTypes.object.isRequired,
  story: PropTypes.object.isRequired
};

export default withStyles(styles, {withTheme: true})(StoryCard);
