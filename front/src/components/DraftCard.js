import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {withStyles} from 'material-ui/styles';
import Card, {CardContent, CardMedia} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import {graphql} from 'react-apollo';
import Edit from "material-ui-icons/Edit";
import Delete from "material-ui-icons/Delete";

//
import {draftsListQuery} from '../graphql/draft';
import {DeleteDraftMutation} from '../graphql/draft';

//
import imageTest from '../images/b.jpg';

const styles = theme => ({
  card: {
    display: 'flex',
    marginTop: 24,
    width: 620,
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

function DraftCard(props) {

  // class DraftCard extends React.Component {

  const handleDelete = () => {
    try {
      props.deleteDraft(props.draft._id)
    } catch (e) {
      console.log(e.graphQLErrors[0].message);
    } finally {}
  }

  // render() {
  const {classes, draft} = props;
  return (

    <div >
      <Card className={classes.card}>
        <Link className={classes.textField} to={`/edit/${draft._id}`}>
          <CardMedia
            className={classes.cover}
            image={imageTest}
            title="Live from space album cover"/>
        </Link>
        <div className={classes.details}>
          <Link className={classes.textField} to={`/edit/${draft._id}`}>
            <CardContent className={classes.content}>
              <Typography type="headline">
                {draft.title}
              </Typography>
              <Typography type="subheading" color="secondary">
                <div>
                  Last Updated: {moment(new Date(draft.lastUpdate)).utc().local().format("YYYY-MM-DD HH:mm")}
                </div>
              </Typography>
            </CardContent>
          </Link>
          <div className={classes.controls}>
            Continue Writing
            <IconButton aria-label="Edit">
              <Edit/>
            </IconButton>

            <IconButton aria-label="Delete" onClick={handleDelete}>
              <Delete/>
            </IconButton>

          </div>
        </div>

      </Card>
    </div>
  );
  // }
}

DraftCard.propTypes = {
  classes: PropTypes.object.isRequired,
  //theme: PropTypes.object.isRequired,
  deleteDraft: PropTypes.func.isRequired,
  draft: PropTypes.object.isRequired
};

export const WithDelete = graphql(DeleteDraftMutation, {
  props: ({mutate}) => ({
    deleteDraft: (draftID) => mutate({
      variables: {
        draftID: draftID
      },
      refetchQueries: [
        {
          query: draftsListQuery
        }
      ]
    })
  })
})

export default WithDelete(withStyles(styles, {withTheme: true})(DraftCard))
