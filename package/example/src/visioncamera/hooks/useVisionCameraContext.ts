import { useContext, useReducer } from 'react'
import { VisionCameraContext, type VisionCameraContextType as VisionCameraStateType } from '../context/VisionCameraContext'
import anylogger from 'anylogger'
import { type PhotoFile, type VideoFile } from 'react-native-vision-camera'

const log = anylogger('vision-camera-module')

export type VisionCameraActionType = {
  payload?: { photoFile?: PhotoFile; videoFile?: VideoFile; type: 'photo' | 'video' }
  type: 'CANCELLED' | 'PHOTO_CAPTURED' | 'SHOW_CAMERA_VIEW' | 'HIDE_CAMERA_VIEW' | 'PREVIEW_PHOTO'
}

const reducer = (state: VisionCameraStateType, action: VisionCameraActionType): VisionCameraStateType => {
//   log.debug('useVisionCameraContext > reducer', state, action)

  switch (action.type) {
    case 'CANCELLED': {
      state.onCancel()
      return {
        ...state,
      }
    }
    case 'PHOTO_CAPTURED':
      state.onPhotoTaken(action.payload?.photoFile as PhotoFile | VideoFile)
      return {
        ...state,
        photoFile: action.payload?.photoFile,
        type: action.payload?.type,
      }
    case 'PREVIEW_PHOTO':
      return {
        ...state,
        photoFile: action.payload?.photoFile,
        type: action.payload?.type,
      }

    case 'SHOW_CAMERA_VIEW':
      return {
        ...state,
        shouldShowCameraView: true,
      }
    case 'HIDE_CAMERA_VIEW':
      return {
        ...state,
        shouldShowCameraView: false,
      }

    default:
      return state
  }
}

/**
 * Provides a state and context for vision camera
 *
 * @returns {{
 *   state:VisionCameraStateType,
 *   dispatch: React.Dispatch
 * }}
 */
export const useVisionCameraContext = (): { state: VisionCameraStateType; dispatch: React.Dispatch<VisionCameraActionType> } => {
  const context = useContext(VisionCameraContext)
  const [state, dispatch] = useReducer(reducer, context, undefined)

  const augmentedDispatch = (args: VisionCameraActionType): void => {
    // log.debug('useVisionCameraContext > augmentedDispatch', args)
    dispatch(args)
  }
  //   log.debug('useVisionCameraContext returning state:', {state, context})
  return { state: { ...state, ...context }, dispatch: augmentedDispatch }
}
