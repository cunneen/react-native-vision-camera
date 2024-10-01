import React, { useCallback } from 'react'
import 'react-native-gesture-handler'
import { AppRegistry, Button, StyleSheet, View } from 'react-native'
import { VisionCamera } from './src/visioncamera/VisionCamera'
import { initialWindowMetrics } from 'react-native-safe-area-context'
import 'anylogger-console'
import { VisionCameraContext, VisionCameraContextType } from './src/visioncamera/context/VisionCameraContext'
import { type PhotoFile, type VideoFile } from 'react-native-vision-camera'

import anylogger from 'anylogger'

const log = anylogger('vision-camera-module')
import 'anylogger-console'
/**
 * This is an example of using React Native Vision Camera as a module within
 * a larger app.
 * The "VisionCamera" component is a simplified version of the example app from
 * the VisionCamera repo: https://github.com/mrousavy/react-native-vision-camera/tree/main/package/example
 */
function VisionCameraExample(): JSX.Element {
  const [shouldShow, setShouldShow] = React.useState(false)

  const handleCancel = useCallback(() => {
    log.debug('VisionCameraExample handleCancel')
    setShouldShow(false)
  }, [])

  const handlePhotoTaken = useCallback((file: PhotoFile | VideoFile) => {
    log.debug('VisionCameraExample handlePhotoTaken', file)
    setShouldShow(false)
  }, [])

  const contextDefaults: VisionCameraContextType = {
    shouldShowCameraView: shouldShow,
    setShouldShowCameraView: setShouldShow,
    onPhotoTaken: handlePhotoTaken,
    onCancel: handleCancel,
  }

  return (
    <View style={styles.root}>
      <VisionCameraContext.Provider value={contextDefaults}>
        {!shouldShow && (
          <View style={styles.showCameraButton}>
            <Button title="Open camera" onPress={() => setShouldShow(true)} />
          </View>
        )}
        <VisionCamera />
      </VisionCameraContext.Provider>
    </View>
  )
}

AppRegistry.registerComponent('VisionCameraExample', () => VisionCameraExample)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // paddingTop: initialWindowMetrics?.insets.top ?? 0,
    // backgroundColor: 'white',
  },
  showCameraButton: {
    position: 'absolute',
    top: initialWindowMetrics?.insets.top ?? 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
