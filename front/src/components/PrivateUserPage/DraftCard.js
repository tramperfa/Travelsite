import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import format from 'date-fns/format'
import {compose} from 'recompose';

//
import {withStyles} from 'material-ui/styles';
import Card, {CardContent, CardMedia} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Edit from "material-ui-icons/Edit";
import Delete from "material-ui-icons/Delete";

//
import {WithDeleteDraftMutation} from '../../graphql/draft';
import ErrorComp from '../../lib/ErrorComp';
import {error, onError} from '../../lib/utils';
import CONSTS from '../../lib/consts';

//
import defaultbrowserCoverImage from '../../images/browserCoverImage.png';

export const styles = theme => ({
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

class DraftCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: error
		}
	}

	handleDelete = () => {
		this.props.deleteDraft(this.props.draft._id).then(() => {
			//this.setState({deleteRedirect: true})
		}).catch((err) => {
			this.setState(onError(err))
		})
	}

	render() {
		const {classes, draft} = this.props;
		return (
			<div>
				<ErrorComp error={this.state.error}/>
				<Card className={classes.card}>
					<Link className={classes.textField} to={`/my/edit/${draft._id}`}>
						<CardMedia
							className={classes.cover}
							image={draft.coverImage
								? CONSTS.BUCKET_NAME + draft.coverImage.browserCoverImage.filename
								: defaultbrowserCoverImage}/>
					</Link>
					<div className={classes.details}>
						<Link className={classes.textField} to={`/my/edit/${draft._id}`}>
							<CardContent className={classes.content}>
								<Typography type="headline">
									{draft.title}
								</Typography>
								<Typography type="subheading" color="secondary">
									<div>
										Last Updated: {format(new Date(draft.lastUpdate), "YYYY-MM-DD HH:mm")}
									</div>
								</Typography>
							</CardContent>
						</Link>
						<div className={classes.controls}>
							Continue Writing
							<IconButton aria-label="Edit">
								<Edit/>
							</IconButton>
							<IconButton aria-label="Delete" onClick={this.handleDelete}>
								<Delete/>
							</IconButton>
						</div>
					</div>
				</Card>
			</div>
		);

	}

}

DraftCard.propTypes = {
	classes: PropTypes.object.isRequired,
	deleteDraft: PropTypes.func.isRequired,
	draft: PropTypes.object.isRequired
};

export default compose(WithDeleteDraftMutation, withStyles(styles))(DraftCard)
