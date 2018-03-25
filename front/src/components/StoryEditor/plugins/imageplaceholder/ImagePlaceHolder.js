import React, {Component} from 'react';
import {CircularProgress} from 'material-ui/Progress';

const CIRCULARSIZE = 40
// const MAXWIDTH = 700

export default class extends Component {

	render() {
		const width = this.props.data.width
		const height = this.props.data.height
		const centerX = (width - CIRCULARSIZE) / 2
		const centerY = (height - CIRCULARSIZE) / 2
		return (
			<div
				style={{
					width: width,
					height: height,
					backgroundColor: "#E8E8E8"
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
						transform: "translate(" + centerX + "px, " + centerY + "px)",
						color: '#0a9bf5'
					}}/>
			</div>
		)
	}
}
