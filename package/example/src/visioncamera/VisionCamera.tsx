import { NavigationContainer } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PermissionsPage } from './pages/PermissionsPage'
import { MediaPage } from './pages/MediaPage'
import { CameraPage } from './pages/CameraPage'
import type { Routes } from './Routes'
import { Camera } from 'react-native-vision-camera'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { DevicesPage } from './pages/DevicesPage'
import anylogger from 'anylogger'
import { useVisionCameraContext } from './hooks/useVisionCameraContext'

const log = anylogger('vision-camera-module')

const Stack = createNativeStackNavigator<Routes>()

export function VisionCamera(): React.ReactElement | null {
  const { state } = useVisionCameraContext()
  const { shouldShowCameraView } = state
  const [show, setShow] = useState(shouldShowCameraView)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    // log.debug('VisionCamera > useEffect; shouldShowCameraView = ', shouldShowCameraView, { state, mountedRef: mountedRef.current }, )
    if (!mountedRef.current) return
    if (show !== shouldShowCameraView) setShow(shouldShowCameraView)
  }, [shouldShowCameraView, show, state])

  if (!show) return null

  const cameraPermission = Camera.getCameraPermissionStatus()

  const showPermissionsPage = cameraPermission !== 'granted'
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={styles.root}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            statusBarStyle: 'dark',
            animationTypeForReplace: 'push',
          }}
          initialRouteName={showPermissionsPage ? 'PermissionsPage' : 'CameraPage'}>
          <Stack.Screen name="PermissionsPage" component={PermissionsPage} />
          <Stack.Screen name="CameraPage" component={CameraPage} />
          <Stack.Screen
            name="MediaPage"
            component={MediaPage}
            options={{
              animation: 'none',
              presentation: 'transparentModal',
            }}
          />
          <Stack.Screen name="Devices" component={DevicesPage} />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})
