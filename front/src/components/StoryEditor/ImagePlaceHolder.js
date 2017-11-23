import React, {Component} from 'react';
import extractSize from './util/ExtractSize'
// import redrawImage from './util/RedrawImage'
// import rotateImage from './util/RotateImage'
import { CircularProgress } from 'material-ui/Progress';

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {width: 0, height: 0}
  }

  setWidthHeight = (newSize) => {
    const {width, height} = newSize
    // console.log("width: " + width + " height: " + height)
    if(width > 700) {
      const newHeight = 700 * height / width
      // console.log("newHeight: " + newHeight);
      this.setState({width: 700, height: newHeight})
    } else {
      this.setState(newSize)
    }
  }

  componentWillMount() {
    const origImageData = this.props.contentState.getEntity(this.props.block.getEntityAt(0)).getData()
    extractSize(origImageData, this.setWidthHeight)
  }

  render () {
    // const contentState = this.props.contentState
    // const block = this.props.block
    // const {orientation, src} = contentState.getEntity(block.getEntityAt(0)).getData()
    const tranX = this.state.width / 2 - 20
    const tranY = this.state.height / 2 - 20
    const tran = "translate(" + tranX + "px, " + tranY + "px)"
    return (
      <div className="imageplaceholder"
        style={this.state} >
        {/* <img
          className="imageplaceholder"
          alt=""
          src = {this.state.src}
          // style = {rotateImage(orientation)}
        /> */}
        {/* <CircularProgress style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}/> */}
        <CircularProgress style={{transform: tran}}/>

        {/* <CircularProgress /> */}
        {/* <FOO /> */}
      </div>
    )
  }
}


// class FOO extends Component {
//   render() {
//     return (
//       <p style={{width: 700, height: 50, background: "pink"}}>
//         Hello World!
//       </p>
//     )
//   }
// }
