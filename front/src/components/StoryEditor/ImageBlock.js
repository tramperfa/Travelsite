import React, {Component} from 'react';

export default class extends Component {
  render () {
    const contentState = this.props.contentState
    const block = this.props.block
    const {src, width, height} = contentState.getEntity(block.getEntityAt(0)).getData()

    return (
      <div style={{width: width, height: height}}>
        <img
          className="image"
          alt=""
          src = {src}
        />
      </div>

    )
  }
}

// const ImageBlock = styled.img`
//   maxWidth: 100%;
//   height: auto
// `
