import React, {Component} from 'react';
import extractSize from './util/ExtractSize'
// import redrawImage from './util/RedrawImage'
// import rotateImage from './util/RotateImage'
import { CircularProgress } from 'material-ui/Progress';

const CIRCULARSIZE = 40
const MAXWIDTH = 700

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {origDimention: {}, scaledDimention: {}, center: {}}
  }

  setWidthHeight = (newSize) => {
    const {width, height} = newSize
    this.setState({origDimention: newSize})
    // console.log("width: " + width + " height: " + height)
    if(width > MAXWIDTH) {
      const newHeight = MAXWIDTH * height / width
      // console.log("newHeight: " + newHeight);
      this.setState({scaledDimention: {width: MAXWIDTH, height: newHeight}, center: {x: (MAXWIDTH - CIRCULARSIZE) / 2, y: (newHeight - CIRCULARSIZE) / 2}})
    } else {
      this.setState({scaledDimention: newSize, center: {x: (width - CIRCULARSIZE) / 2, y: (height - CIRCULARSIZE) / 2}})
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
    return (
      <div className="imageplaceholder"
        style={this.state.scaledDimention} >
        {/* <img
          className="imageplaceholder"
          alt=""
          src = {this.state.src}
          // style = {rotateImage(orientation)}
        /> */}
        {/* <CircularProgress style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}/> */}
        <CircularProgress style={{transform: "translate(" + this.state.center.x + "px, " + this.state.center.y + "px)"}}/>

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
