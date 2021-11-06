import * as React from 'react'
import yell from /* webpackPrefetch: true */ '../audio/yell.mp3'
import porgSadWebm from '../img/porg-sad.webm'
import porgYellWebm from '../img/porg-yell.webm'
import porgSadMp4 from '../img/porg-sad.mp4'
import porgYellMp4 from '../img/porg-yell.mp4'

import './global.scss'
import ImageViewer, { Videos } from './ImageViewer';
import { Install } from './Install';

class State {
  constructor(
    readonly isYelling: boolean = false
  ) {
  }
}

const startTime = 13
const PorgVideos: Videos = {
  webm: [porgSadWebm, porgYellWebm],
  mp4: [porgSadMp4, porgYellMp4]
}

export default class App extends React.Component<{}, State> {
  state = new State()

  private sound: HTMLAudioElement

  constructor(props: any) {
    super(props);
    this.sound = new Audio(yell);
    this.sound.load();
    console.log('loaded')
    this.sound.currentTime = startTime
    this.sound.crossOrigin = 'anonymous'
    this.sound.addEventListener('ended', function () {
      this.currentTime = startTime;
      return this.play()
    }, false)
  }

  render() {
    const yelling = this.state.isYelling
    const words = yelling ? '' : 'Click Me!'
    const index = yelling ? 1 : 0

    return <div className="container">

      <ImageViewer videos={PorgVideos} active={index} onClick={this.onClick}>
        <p id="words" className="centered">{words}</p>
      </ImageViewer>
      <Install/>
    </div>
  }

  onClick = () => {
    const {isYelling} = this.state
    this.setState({isYelling: !isYelling})
    if (isYelling) {
      this.sound.pause()
    } else {
      this.sound.currentTime = startTime
      console.log(this.sound.currentTime)
      this.sound.play()
    }
  }
}
