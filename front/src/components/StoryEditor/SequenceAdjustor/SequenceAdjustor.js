import React, {Component} from 'react'
import Dialog, {DialogActions, DialogContent} from 'material-ui/Dialog'
import {withStyles} from 'material-ui/styles'
import ChevronLeft from 'material-ui-icons/ChevronLeft'
import Button from 'material-ui/Button'
import Done from 'material-ui-icons/Done'
import Clear from 'material-ui-icons/Clear'

import DragAndDrop from './DragAndDrop'
import groupBlocks from './groupBlocks'

class SequenceAdjustor extends Component {
	state = {
		open: false
	}

	open = () => {
		this.setState({open: true})
	}

	close = () => {
		// console.log("close drawer");
		this.setState({open: false})
	}

	sequenceConfirmed = () => {
		this.dnd.onConfirm()
		this.close()
	}

	sequenceCancelled = () => {
		this.close()
	}

	render() {
		const origContentArray = this.props.contentState.getBlockMap().toArray()

		const convertedArray = groupBlocks(origContentArray, this.props.imageArray)

		const {classes} = this.props

		return (
			<div className="sequenceAdjustor">
				<div onClick={this.open}>
					<ChevronLeft/>
					<ChevronLeft/>
				</div>
				<Dialog
					classes={{
						paper: classes.dialog
					}}
					open={this.state.open}
					onClose={this.close}
					disableBackdropClick={true}
					disableEscapeKeyDown={true}
					fullWidth={true}
					maxWidth={false}>
					<DialogContent>
						<DragAndDrop
							updateEditor={this.props.onSequenceChanged}
							origContentState={this.props.contentState}
							paragraphGroups={convertedArray}
							ref={(element) => {
								this.dnd = element
							}}/>
					</DialogContent>
					{/* <DragAndDrop paragraphGroups={convertedArray}/> */}
					<DialogActions>
						<div className="dialogActionItem">
							<Button color="primary" onClick={this.sequenceConfirmed}>
								<Done/>
							</Button>
						</div>
						<div className="dialogActionItem">
							<Button color="primary" onClick={this.close}>
								<Clear/>
							</Button>
						</div>
					</DialogActions>
				</Dialog>
			</div>
		)
	}
}

const styles = theme => ({
	dialog: {
		height: '85%'
	}
})

export default withStyles(styles)(SequenceAdjustor)
