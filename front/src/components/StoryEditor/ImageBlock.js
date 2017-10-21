import React, {Component} from 'react';
import styled from 'styled-components'

export default class extends Component {
  render () {
    return (
      <ImageBlock />
    )
  }
}

const ImageBlock = styled.img`
  display: inline-block;
  maxWidth: 800px;
  height: auto
`
