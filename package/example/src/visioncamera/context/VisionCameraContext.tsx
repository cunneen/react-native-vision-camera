import { createContext } from 'react'
import type { PhotoFile, VideoFile } from 'react-native-vision-camera'
import anylogger from 'anylogger'

const log = anylogger('vision-camera-module')

// ====== initial values ======
let _shouldShowCameraView = false
const _onPhotoTaken = (file: PhotoFile | VideoFile): void => {
  log.debug('onPhotoTaken', file)
}
const _setShouldShowCameraView = (shouldShowCameraView: boolean): void => {
  _shouldShowCameraView = shouldShowCameraView
}

const _onCancel = (): void => {
  log.debug('onCancel')
  _setShouldShowCameraView(false)
}

// ====== context definition ======
export type VisionCameraContextType = {
  shouldShowCameraView: boolean
  setShouldShowCameraView: (shouldShowCameraView: boolean) => void
  onPhotoTaken: (file: PhotoFile | VideoFile) => void
  onCancel: () => void
  photoFile?: PhotoFile
  videoFile?: VideoFile
  type?: 'photo' | 'video'
}

export const VisionCameraContext: React.Context<VisionCameraContextType> = createContext({
  shouldShowCameraView: _shouldShowCameraView,
  setShouldShowCameraView: _setShouldShowCameraView,
  onPhotoTaken: _onPhotoTaken,
  onCancel: _onCancel,
} as VisionCameraContextType)
