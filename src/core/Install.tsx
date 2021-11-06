import * as React from 'react'
import { installPrompt } from './installPrompt';

export function Install() {
  const [prompt, promptToInstall] = installPrompt();
  const [isVisible, setVisibleState] = React.useState(false);

  React.useEffect(() => {
    if (prompt) {
      setVisibleState(true)
    }
  }, [prompt]);

  if (!isVisible) {
    return <div/>;
  }

  return (
    <div>
      <button onClick={promptToInstall}>Add to Homescreen</button>
    </div>
  );
}
