import React, {Component} from 'react';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import Pagination from './Pagination';

import imageA from '../images/a.jpg';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = {
  root: {
    position: 'relative'
  },
  slide: {
    // padding: 15,
    height: '400px',
    width: 'auto'
    // color: '#fff'
  },
  slide1: {
    backgroundColor: '#FEA900'
  },
  slide2: {
    backgroundColor: '#B3DC4A'
  },
  slide3: {
    backgroundColor: '#6AC0FF'
  },
  slide4: {
    backgroundColor: '#6AC000'
  }
};

class DemoAutoPlay extends Component {
  state = {
    index: 0
  };

  handleChangeIndex = index => {
    this.setState({index});
  };

  render() {
    const {index} = this.state;

    return (
      <div style={styles.root}>
        <AutoPlaySwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
          <div style={styles.slide}>
            <img src={imageA} alt="imageA"/>
          </div>
          <div style={Object.assign({}, styles.slide, styles.slide2)}>slide n°2</div>
          {/* <div style={Object.assign({}, styles.slide, styles.slide3)}>slide n°3</div>
          <div style={Object.assign({}, styles.slide, styles.slide4)}>slide n°4</div> */}
        </AutoPlaySwipeableViews>
        <Pagination dots={2} index={index} onChangeIndex={this.handleChangeIndex}/>
      </div>
    );
  }
}

export default DemoAutoPlay;
