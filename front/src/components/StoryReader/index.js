import React from 'react';
import PropTypes from 'prop-types';
//import {connect} from 'react-redux';

//
import {WithStoryDetialsQuery} from '../../graphql/story'
import ComposeQuery from '../../lib/hoc';

//
import HeadlineSection from './HeadlineSection';
import ContentSection from './contentReader/ContentSection';
import FunctionSectionContainer from './FunctionSectionContainer';
import CommentSection from './CommentSection';

class StoryReaderContainer extends React.Component {
	render() {
		const story = this.props.storyDetailData.story;
		console.log(story);
		return (
			<div className="topContainter">
				<HeadlineSection title={story.title} headlineImage={story.headlineImage}/>
				<div className="storyContainer">
					<FunctionSectionContainer
						match={this.props.match}
						storyDetailData={this.props.storyDetailData}/>
					<ContentSection content={story.content} images={story.images}/>
					<CommentSection/>
				</div>
			</div>
		)
	}
}

//

StoryReaderContainer.propTypes = {
	match: PropTypes.object.isRequired,
	storyDetailData: PropTypes.object.isRequired
}

const StoryReaderContainerWithComposeQuery = ComposeQuery(
	StoryReaderContainer,
	'storyDetailData'
)

export default WithStoryDetialsQuery(StoryReaderContainerWithComposeQuery)