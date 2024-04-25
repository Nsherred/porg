import * as React from 'react'

const Loading: React.FC<{ className?: string }> = () =>
  <span>
    <svg viewBox="0 0 100 100" version="1.1" className="loading">
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="#d2d2cb"
        strokeWidth="10"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
        transform="rotate(41.6779 50 50)"
      />
    </svg>
  </span>

export default Loading
