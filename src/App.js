import React, { Component } from 'react'
import './App.css'
import { getVideoDevices, isCameraSupported } from './config'

export class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      devices: []
    }
    this.videoContainer = React.createRef()
    this.canvasRef = React.createRef()
  }

  async componentDidMount () {
    if (isCameraSupported()) {
      this.setState({ devices: await getVideoDevices() })
    }
  }

  handleStartStream = () => {
    if (isCameraSupported()) {
      const constraints = {
        video: {
          width: { min: 1280, ideal: 1920, max: 2560 },
          height: { min: 720, ideal: 1080, max: 1440 }
        },
        audio: true
      }

      this.startStream(constraints)
    }
  }

   startStream = async (constraints) => {
     const stream = await navigator.mediaDevices.getUserMedia(constraints)
     this.handleSuccess(stream)
   }

   handlePauseStream = () => this.videoContainer.current.pause()

   handleDoScreenshot = () => {
     this.canvasRef.current.width = this.videoContainer.current.videoWidth
     this.canvasRef.current.height = this.videoContainer.current.videoHeight
     this.canvasRef.current.getContext('2d').drawImage(this.videoContainer.current, 0, 0)
   }

  handleSuccess = (stream) => {
    this.videoContainer.current.srcObject = stream
    const shouldStop = false
    let stopped = false
    const downloadLink = document.getElementById('download')

    const options = { mimeType: 'video/webm' }
    const recordedChunks = []
    const mediaRecorder = new MediaRecorder(stream, options)

    mediaRecorder.addEventListener('dataavailable', function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data)
      }

      if (shouldStop === true && stopped === false) {
        mediaRecorder.stop()
        stopped = true
      }
    })

    mediaRecorder.addEventListener('stop', function () {
      downloadLink.href = URL.createObjectURL(new Blob(recordedChunks))
      downloadLink.download = 'acetest.webm'
    })

    mediaRecorder.start()
  }

  render () {
    return (
      <div>
        <video ref={this.videoContainer} autoPlay />
        <div className='controls'>
          <button onClick={this.handleStartStream}>Play</button>
          <button onClick={this.handlePauseStream}>Pause</button>
          <button onClick={this.handleDoScreenshot}>Screenshot</button>
        </div>
        <a href='/#' id='download'>Download</a>

        <div className='video-options'>
          <select name='' id='' className='custom-select'>
            <option value=''>Select camera</option>
            {this.state.devices.map((device, idx) => <option key={idx} value={device.deviceId}>Camera {idx + 1}</option>)}
          </select>
        </div>
        <canvas ref={this.canvasRef} className='d-none' />
        {/* <img className='screenshot-image d-none' alt='' /> */}

      </div>
    )
  }
}

export default App
