import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PermissionsPage } from './pages/PermissionsPage'
import { MediaPage } from './pages/MediaPage'
import { CameraPage } from './pages/CameraPage'
import type { Routes } from './Routes'
import { Camera, type PhotoFile, type VideoFile } from 'react-native-vision-camera'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { DevicesPage } from './pages/DevicesPage'

const Stack = createNativeStackNavigator<Routes>()

export type VisionCameraProps = {
  isShown: boolean
  handlePhotoTaken: (file: PhotoFile | VideoFile) => void
  handleCancel: () => void
}

export function VisionCamera(props: VisionCameraProps): React.ReactElement | null {
  const { isShown, handlePhotoTaken, handleCancel } = props

  if (!isShown) return null

  const CancelledRoute = (): JSX.Element | null => {
    React.useEffect(() => {
      handleCancel()
    }, [])
    return null
  }

  type FinishedRouteProps = NativeStackScreenProps<Routes, 'Finished'>
  const FinishedRoute = ({ route }: FinishedRouteProps): JSX.Element | null => {
    const { file, type } = route.params
    React.useEffect(() => {
      handlePhotoTaken(file)
    }, [file, type])
    return null
  }

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
          initialRouteName={showPermissionsPage ? 'PermissionsPage' : 'CameraPage'}
          screenListeners={{
            state: (e) => {
              // Do something with the state
              console.log('state changed')
              console.log(e.data)
            },
          }}>
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
          <Stack.Screen name="Cancelled" component={CancelledRoute} />
          <Stack.Screen name="Finished" component={FinishedRoute} />
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
