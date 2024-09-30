import React from 'react'
import 'react-native-gesture-handler'
import { AppRegistry, Button, StyleSheet, View } from 'react-native'
import { VisionCamera } from './src/VisionCamera'
import { initialWindowMetrics } from 'react-native-safe-area-context'

function VisionCameraExample(): JSX.Element {
  const [shouldShow, setShouldShow] = React.useState(false)

  return (
    <View style={styles.root}>
      {!shouldShow && (
        <View style={styles.showCameraButton}>
          <Button title="Open camera" onPress={() => setShouldShow(true)} />
        </View>
      )}
      <VisionCamera
        handleCancel={() => {
          console.log('handleCancel')
          setShouldShow(false)
        }}
        handlePhotoTaken={(file) => {
          console.log('handlePhotoTaken', file)
          setShouldShow(false)
        }}
        isShown={shouldShow}
      />
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
