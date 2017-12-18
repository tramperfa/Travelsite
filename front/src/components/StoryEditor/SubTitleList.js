// import React, {Component} from 'react';
import React from 'react';
import {List} from 'immutable'

const SubTitleList = (props) => {
	const list = buildTitleList(props.subTitleList)
	return (<ul>
		{list}
	</ul>)
}

const buildTitleList = (subTitleList) => {
	let list = List()
	if (subTitleList) {
		subTitleList = subTitleList.map((title, key) => {
			return {key: key, title: title}
		})
		list = list.concat(subTitleList.toArray())
	}

	const listItems = list.toArray().map(
		(title) => <TitleItem key={title.key} titleKey={title.key} title={title.title}/>
	)
	return listItems
}

const TitleItem = (props) => (
	<li>
		<a href={"#" + props.titleKey} style={{
				color: 'blue'
			}}>
			{props.title}
		</a>
	</li>
)

export default SubTitleList
