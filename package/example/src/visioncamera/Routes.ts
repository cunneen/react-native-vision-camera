import type { PhotoFile, VideoFile } from 'react-native-vision-camera'

type Handlers = {
  // handlePhotoTaken: (file: PhotoFile | VideoFile) => void
  // handleCancel: () => void
}

type HandlersWithParams = Handlers & {
  file: PhotoFile | VideoFile
  type: 'video' | 'photo'
}

export type Routes = {
  PermissionsPage: undefined
  CameraPage: undefined
  MediaPage: HandlersWithParams
  Devices: undefined
}
