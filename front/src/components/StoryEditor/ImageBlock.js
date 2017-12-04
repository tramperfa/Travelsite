import React, {Component} from 'react';
import LazyLoad from 'react-lazyload'

import ImagePlaceHolder from './ImagePlaceHolder'

export default class extends Component {
  render () {
    const {src, width, height} = this.props.blockProps
    // console.log(height)
    return (
      <LazyLoad
        throttle={2000}
        height={height}
        placeholder={<ImagePlaceHolder width={width} height={height}/>}>
        <img
          className="image"
          alt=""
          src = {src}
        />
      </LazyLoad>

      // <div style={{width: width, height: height}}>
      //   <img
      //     className="image"
      //     alt=""
      //     src = {src}
      //   />
      // </div>

    )
  }
}

// const ImageBlock = styled.img`
//   maxWidth: 100%;
//   height: auto
// `
