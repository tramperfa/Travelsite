import React, {Component} from 'react';
import {CircularProgress} from 'material-ui/Progress';

const CIRCULARSIZE = 40
// const MAXWIDTH = 700

export default class extends Component {

	render() {
		const width = this.props.width
		const height = this.props.height
		const centerX = (width - CIRCULARSIZE) / 2
		const centerY = (height - CIRCULARSIZE) / 2
		return (
			<div
				style={{
					width: width,
					height: height,
					backgroundColor: "#C0C0C0"
				}}>
				{/* <img
          className="imageplaceholder"
          alt=""
          src = {this.state.src}
          // style = {rotateImage(orientation)}
        /> */
				}
				<CircularProgress
					style={{
						transform: "translate(" + centerX + "px, " + centerY + "px)"
					}}/>
			</div>
		)
	}
}
