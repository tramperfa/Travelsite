import React, {Component} from 'react';

export default class extends Component {
	render() {
		return (
			<ul>
				{
					this.props.subTitleList && this.props.subTitleList.entrySeq().map((title) => {
						return (
							<li key={title[0]}>
								<a href={"#" + title[0]} style={{
										color: 'blue'
									}}>
									{title[1]}
								</a>
							</li>
						)
					})
				}
			</ul>
		)
	}
}
