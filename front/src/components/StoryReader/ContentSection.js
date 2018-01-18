import React from 'react';
import moment from 'moment';

const ContentSection = ({story}) => {
	return (
		//

		<div>
			<div>{"Author: " + story.author.fullName}</div>
			<div>{story.likeStoryCount + "Likes"}</div>
			<div>{story.viewCount + "Views"}</div>
			<div>{story.archiveStoryCount + "Archives"}</div>

			<div>
				{moment(new Date(story.lastUpdate)).utc().local().format("YYYY-MM-DD HH:mm")}
			</div>

		</div>
	)
};

export default ContentSection
