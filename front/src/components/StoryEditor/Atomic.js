import React, {Component} from "react"
import {EditorState, SelectionState} from "draft-js"

export default class Atomic extends Component {

	remove = () => {
		const {editorState} = this.props.blockProps;
		console.log(editorState);
		const selection = editorState.getSelection();
		const content = editorState.getCurrentContent();
		const keyAfter = content.getKeyAfter(this.props.block.key);
		const blockMap = content.getBlockMap().delete(this.props.block.key);
		const withoutAtomicBlock = content.merge({blockMap, selectionAfter: selection});
		const newState = EditorState.push(
			editorState,
			withoutAtomicBlock,
			"remove-range"
		);
		const newSelection = new SelectionState(
			{anchorKey: keyAfter, anchorOffset: 0, focusKey: keyAfter, focusOffset: this.props.block.getLength()}
		);
		const newEditorState = EditorState.forceSelection(newState, newSelection);
		this.props.blockProps.onChange(newEditorState);
		if (this.props.block.getData().toJS().type === 'subTitle') {
			this.props.blockProps.deleteSubTitle(this.props.block.getKey())
		}
	}

	edit = () => {
		console.log("Edit!");
		this.props.blockProps.openSubTitleEditor(
			this.props.block.getKey(),
			this.props.block.getData().toJS().title
		)
	}

	setAsCoverPhoto = () => {
		const data = this.props.block.getData().toJS()
		console.log(data._id);
	}

	render() {
		const data = this.props.block.getData().toJS()
		const {plugin} = this.props.blockProps
		const Block = plugin.blockComponent
		return (
			<Block
				blockKey={this.props.block.getKey()}
				data={data}
				container={this}
				blockProps={this.props.blockProps}/>
		)
	}
}
