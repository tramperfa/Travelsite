import React from 'react'

import TextField from 'material-ui/TextField'

export default function AtomicInput(props) {
	let style = {
		width: 400,
		position: "absolute",
		left: -410,
		background: "#ffffff"
	}
	return (
		<div style={{
				position: "relative"
			}}>
			{props.children}
			{
				props.active && <TextField
						autoFocus={true}
						onBlur={props.onBlur}
						label={props.hintText}
						placeholder={props.hintText}
						defaultValue={props.text}
						onChange={props.onChange}
						onKeyPress={props.onKeyPress}
						style={style}/>
			}
		</div>
	)
}
