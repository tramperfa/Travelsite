import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
//import {connect} from 'react-redux';

//
import {WithStoryDetialsQuery} from '../../graphql/story'
import {WithUserSelfStoryReaderQuery} from '../../graphql/user';
import ComposeQuery from '../../lib/hoc';

//
import HeadlineSection from './HeadlineSection';
import ContentSection from './contentReader/ContentSection';
import FunctionSectionContainer from './FunctionSectionContainer';
import CommentSection from './CommentSection';

class StoryReaderContainer extends React.Component {
	render() {
		const story = this.props.storyDetailData.story;
		// console.log(story);
		return (
			<div className="topContainter">
				<HeadlineSection title={story.title} headlineImage={story.headlineImage}/>
				<div className="storyInfoBar">
					<div className="storyInfoContainer">
						<FunctionSectionContainer
							MeData={this.props.MeData}
							match={this.props.match}
							storyDetailData={this.props.storyDetailData}/>
					</div>
				</div>
				<div className="storyContainer">
					<ContentSection
						match={this.props.match}
						author={story.author}
						content={story.content}
						images={story.imageArray}/>
					<CommentSection
						MeData={this.props.MeData}
						images={story.images}
						match={this.props.match}/>
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

const StoryReaderContainerWithComposeQuery2 = ComposeQuery(
	StoryReaderContainerWithComposeQuery,
	'MeData'
)

export default compose(WithStoryDetialsQuery, WithUserSelfStoryReaderQuery)(
	StoryReaderContainerWithComposeQuery2
)
