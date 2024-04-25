import * as React from 'react'

export interface Videos {
  webm: string[]
  mp4: string[]
}

interface Props {
  videos: Videos
  active: number
  onClick: () => void
  children: React.ReactNode
}

export default class ImageViewer extends React.Component<Props> {

  render() {
    const { active, videos: { webm, mp4 } } = this.props
    return <div>
      <video
        key={active}
        autoPlay={true}
        muted={true}
        loop={true}
        onClick={this.props.onClick}
        crossOrigin="anonymous"
      >
        <source src={webm[active]} type="video/webm" />
        <source src={mp4[active]} type="video/mp4" />

        <p className="highlight">
          This is fallback content to display for user agents
          that do not support the video tag.
        </p>
      </video>
      {this.props.children}
    </div>
  }
}
