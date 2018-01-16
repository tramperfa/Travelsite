import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import PropTypes from 'prop-types';
import Card, {CardContent, CardMedia, CardTitle} from 'material-ui/Card';
import {withStyles} from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Comment from "material-ui-icons/Comment"
import Typography from 'material-ui/Typography';

import imageB from '../images/b.jpg';
import imageC from '../images/c.jpg';
import Pagination from './Pagination';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

// const styles = theme => ({
const styles = {
	root: {
		position: 'absolute'
	},
	card: {
		display: 'flex',
		width: 1500,
		height: 900
	},
	backgroud: {
		minWidth: 1500,
		height: 900
	}
}
// });

class Converflow extends React.Component {
	state = {
		index: 0
	};

	handleChangeIndex = index => {
		this.setState({index});
	};

	render() {
		const {index} = this.state;

		return (
			<div style={styles.root}>
				<AutoPlaySwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
					<div>
						<Card style={styles.card}>
							<CardMedia style={styles.backgroud} image={imageB}/>
							<IconButton aria-label="Comment">
								<Comment/>
							</IconButton>
							<CardContent >
								<Typography type="headline">
									The Title Goes Here
								</Typography>
							</CardContent>
						</Card>
					</div>
					{/* <div>
            <Card style={styles.card}>
              <CardMedia style={styles.backgroud} image={imageC}/>
              <IconButton aria-label="Comment">
                <Comment/>
              </IconButton>
              <CardContent >
                <Typography type="headline">
                  The Title Goes Here
                </Typography>
              </CardContent>
            </Card>
          </div> */
					}
				</AutoPlaySwipeableViews>
				<Pagination dots={2} index={index} onChangeIndex={this.handleChangeIndex}/>
			</div>
		);
	}
}

export default Converflow;

// Converflow.propTypes = {   classes: PropTypes.object.isRequired }
//
// export default withStyles(styles)(Converflow);