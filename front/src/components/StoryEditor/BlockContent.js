import React, {Component} from 'react'

import CONSTS from '../../lib/consts'

const ACTION_HEIGHT = CONSTS.ACTION_HEIGHT
export default class BlockContent extends Component {
	render() {
		return (
			<div style={{
					position: "relative",
					top: -ACTION_HEIGHT
				}}>
				{this.props.children}
			</div>
		)
	}
}
