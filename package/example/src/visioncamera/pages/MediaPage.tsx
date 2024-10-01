import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ImageLoadEventData, NativeSyntheticEvent } from 'react-native'
import { ActivityIndicator, Alert, Image, StyleSheet, View } from 'react-native'
import { PressableOpacity } from 'react-native-pressable-opacity'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { CONTENT_SPACING, CONTROL_BUTTON_SIZE, SAFE_AREA_PADDING } from '../Constants'
import type { Routes } from '../Routes'
import { StatusBarBlurBackground } from '../views/StatusBarBlurBackground'
import anylogger from 'anylogger'
import { useVisionCameraContext } from '../hooks/useVisionCameraContext'
import { type PhotoFile } from 'react-native-vision-camera'
const log = anylogger('vision-camera-module')

type OnLoadImage = NativeSyntheticEvent<ImageLoadEventData>

type Props = NativeStackScreenProps<Routes, 'MediaPage'>
export function MediaPage({ navigation, route }: Props): React.ReactElement {
  const mountedRef = useRef(true)
  const { file, type } = route.params
  const { dispatch } = useVisionCameraContext()

  // log.debug('MediaPage2 > state', state)

  const [hasMediaLoaded, setHasMediaLoaded] = useState(false)
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>('none')

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const onMediaLoad = useCallback((event: OnLoadImage) => {
    const source = event.nativeEvent.source
    log.debug(`Image loaded. Size: ${source.width}x${source.height}`)
  }, [])
  const onMediaLoadEnd = useCallback(() => {
    if (!mountedRef.current) return
    log.debug('media has loaded.')
    setHasMediaLoaded(true)
  }, [])

  const onSavePressed = useCallback(() => {
    try {
      if (!mountedRef.current) return
      setSavingState('saving')

      // await CameraRoll.save(`file://${path}`, {
      //   type: type,
      // })
      dispatch({
        type: 'PHOTO_CAPTURED',
        payload: { photoFile: file as PhotoFile, type },
      })
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (mountedRef.current) setSavingState('saved')

      // handleCancel()
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e)
      if (mountedRef.current) setSavingState('none')

      Alert.alert('Failed to save!', `An unexpected error occured while trying to handle your ${type}. ${message}`)
    }
  }, [dispatch, file, type])

  const source = useMemo(() => ({ uri: `file://${file.path}` }), [file.path])

  const screenStyle = useMemo(() => ({ opacity: hasMediaLoaded ? 1 : 0 }), [hasMediaLoaded])

  return (
    <View style={[styles.container, screenStyle]}>
      {type === 'photo' && (
        <Image source={source} style={StyleSheet.absoluteFill} resizeMode="contain" onLoadEnd={onMediaLoadEnd} onLoad={onMediaLoad} />
      )}

      <PressableOpacity style={styles.closeButton} onPress={navigation.goBack}>
        <IonIcon name="close" size={35} color="white" style={styles.icon} />
      </PressableOpacity>

      <PressableOpacity style={styles.saveButton} onPress={onSavePressed} disabled={savingState !== 'none'} disabledOpacity={1}>
        {/* {savingState === 'none' && <IonIcon name="download" size={35} color="white" style={styles.icon} />} */}
        {savingState === 'none' && <IonIcon name="checkmark" size={35} color="white" style={styles.icon} />}
        {savingState === 'saving' && <ActivityIndicator color="lightgrey" />}
      </PressableOpacity>

      <StatusBarBlurBackground />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: SAFE_AREA_PADDING.paddingTop,
    left: SAFE_AREA_PADDING.paddingLeft,
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  saveButton: {
    position: 'absolute',
    bottom: SAFE_AREA_PADDING.paddingBottom,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    marginBottom: CONTENT_SPACING,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  icon: {},
})
