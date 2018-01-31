import React from 'react';

import CONSTS from '../../lib/consts';
import defaultImageHeadline from '../../images/headlineImage.jpg';

const HeadlineSection = ({title, headlineImage}) => {
	return (
		//
		<div>
			{"Tiltle(To be moved on top of image): " + title}
			<span>
				<img
					className="headlineImage"
					src={headlineImage
						? CONSTS.BUCKET_NAME + headlineImage.browserHeadlineImage.filename
						: defaultImageHeadline}
					alt='headline'/>
			</span>
		</div>
	)
};

export default HeadlineSection;
