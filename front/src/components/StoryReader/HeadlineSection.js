import React from 'react';

import CONSTS from '../../lib/consts';
import defaultImageHeadline from '../../images/headlineImage.jpg';

const HeadlineSection = ({title, headlineImage}) => {
	return (
		//
		<div style={{
				position: 'relative'
			}}>
			<div>
				<img
					className="headlineImage"
					src={headlineImage
						? CONSTS.BUCKET_NAME + headlineImage.browserHeadlineImage.filename
						: defaultImageHeadline}
					alt='headline'/>
			</div>
			<h1 className="storyReaderTitle">{title}</h1>
		</div>
	)
};

export default HeadlineSection;
