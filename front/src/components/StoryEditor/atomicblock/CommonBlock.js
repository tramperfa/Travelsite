import React, {Component} from "react"

import BlockWrapper from './BlockWrapper'
import BlockControls from './BlockControls'
import BlockActionGroup from './BlockActionGroup'

export default class CommonBlock extends Component {
	state = {
		onHover: false
	}
	onMouseEnter = () => {
		this.setState({onHover: true})
	}
	onMouseLeave = () => {
		this.setState({onHover: false})
	}
	render() {
		return (
			<BlockWrapper
				style={this.props.style}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}>
				<BlockControls
					style={{
						visibility: this.state.onHover
							? "visible"
							: "hidden"
					}}>
					<BlockActionGroup items={this.props.actions}/>
				</BlockControls>

				{this.props.children}
			</BlockWrapper>
		)
	}

}
