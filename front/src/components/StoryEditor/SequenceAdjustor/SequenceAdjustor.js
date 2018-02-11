import React, {Component} from 'react'
import Drawer from 'material-ui/Drawer'
import ChevronLeft from 'material-ui-icons/ChevronLeft'

export default class SequenceAdjustor extends Component {
	state = {
		right: false
	}

	openDrawer = () => {
		this.setState({right: true})
	}

	closeDrawer = () => {
		console.log("close drawer");
		this.setState({right: false})
	}

	render() {
		return (
			<div className="sequenceAdjustor">

				<div onClick={this.openDrawer}>
					<ChevronLeft/>
					<ChevronLeft/>
				</div>
				<Drawer anchor="right" open={this.state.right} onClose={this.closeDrawer}>
					<div
						style={{
							width: 300,
							height: 100,
							background: 'yellow'
						}}
						onClick={this.closeDrawer}>
						Hello world!
					</div>
				</Drawer>
			</div>
		)
	}
}
