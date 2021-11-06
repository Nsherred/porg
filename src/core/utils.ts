const DEBUG_MODE = location.hostname === 'localhost';

export function debugLog(message: string) {
  if (DEBUG_MODE) {
    console.debug(message)
  }
}
