const isCameraSupported = () =>
  'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices

const getVideoDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices.filter((device) => device.kind === 'videoinput')
}

export {
  isCameraSupported,
  getVideoDevices
}
