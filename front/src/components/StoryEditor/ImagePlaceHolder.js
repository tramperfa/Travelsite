import React, {Component} from 'react';

import { CircularProgress } from 'material-ui/Progress';

export default class extends Component {
  render () {
    const contentState = this.props.contentState
    const block = this.props.block
    const {src} = contentState.getEntity(block.getEntityAt(0)).getData()
    return (
      <div>
        <img
          className="imageplaceholder"
          alt=""
          src = {src}
        />
        {/* <CircularProgress style={{position: "absolute", top: "50%", left: "50%", bottom: "50%", transform: "translate(-50%, -50%)"}}/> */}
      </div>
    )
  }
}
