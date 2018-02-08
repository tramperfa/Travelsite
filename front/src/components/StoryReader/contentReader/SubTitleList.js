import React from 'react'

const SubTitleList = (props) => {
	return (
		<ul>
			{
				props.subTitleList.map(
					(subTitle) => <li key={subTitle.key}>
						<a href={"#" + subTitle.key} style={{
								color: 'blue'
							}}>
							{subTitle.title}
						</a>
					</li>
				)
			}
		</ul>
	)
}

export default SubTitleList
