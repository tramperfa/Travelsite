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
			<h1
				style={{
					position: 'absolute',
					marginTop: 0,
					bottom: 0,
					left: '25%',
					right: '25%',
					paddingLeft: 10,
					color: '#fff'
				}}>{title}</h1>
		</div>
	)
};

export default HeadlineSection;
