import React, {Component} from 'react';
import styled from 'styled-components'

import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui-icons/Edit'
import Delete from 'material-ui-icons/Delete'

export default class extends Component {
  onMouseEnter = () => {
    // console.log("Mouse Enter!")
  }

  onMouseLeave = () => {
    // console.log("Mouse Leave!")
  }

  render () {
    const text = this.props.blockProps.text
    return (
      <TitleBlock
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>
        <a name={text}></a>
        <h1>
          {text}
        </h1>
        <IconButton>
          <Edit />
        </IconButton>
        <IconButton>
          <Delete />
        </IconButton>
      </TitleBlock>
    )
  }
}

const TitleBlock = styled.div `
  width: 100%;
  background: #e4f0f5;
  display: flex;
  flex-direction: row;
`
