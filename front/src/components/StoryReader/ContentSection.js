import React from 'react';

const ContentSection = ({content}) => {
	let tempMainContent = JSON.stringify(content)
	return (
		//
		<div>
			Main Content: {tempMainContent}
		</div>
	)
};

export default ContentSection
