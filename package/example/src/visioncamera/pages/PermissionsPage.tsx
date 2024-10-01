import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useState } from 'react'
import type { ImageRequireSource } from 'react-native'
import { Image, Linking, StyleSheet, Text, View } from 'react-native'
import type { CameraPermissionStatus } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
import { CONTENT_SPACING, SAFE_AREA_PADDING } from '../Constants'
import type { Routes } from '../Routes'
import anylogger from 'anylogger'
const log = anylogger('vision-camera-module')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BANNER_IMAGE = require('../img/11.png') as ImageRequireSource

type Props = NativeStackScreenProps<Routes, 'PermissionsPage'>
export function PermissionsPage({ navigation }: Props): React.ReactElement {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>('not-determined')

  const requestCameraPermission = useCallback(async () => {
    log.debug('Requesting camera permission...')
    const permission = await Camera.requestCameraPermission()
    log.debug(`Camera permission status: ${permission}`)

    if (permission === 'denied') await Linking.openSettings()
    setCameraPermissionStatus(permission)
  }, [])

  useEffect(() => {
    if (cameraPermissionStatus === 'granted') navigation.replace('CameraPage')
  }, [cameraPermissionStatus, navigation])

  return (
    <View style={styles.container}>
      <Image source={BANNER_IMAGE} style={styles.banner} />
      <View style={styles.permissionsContainer}>
        {cameraPermissionStatus !== 'granted' && (
          <Text style={styles.permissionText}>
            This app needs <Text style={styles.bold}>Camera permission</Text>.{' '}
            <Text style={styles.hyperlink} onPress={requestCameraPermission}>
              Grant
            </Text>
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    opacity: 0.4,
    bottom: 0,
    left: 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    ...SAFE_AREA_PADDING,
  },
  permissionsContainer: {
    marginTop: CONTENT_SPACING * 2,
  },
  permissionText: {
    fontSize: 17,
  },
  hyperlink: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
})
