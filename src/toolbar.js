import React from 'react'
import { Camera } from 'expo-camera'
import { View, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native'
import style from './styles'
import { Ionicons } from '@expo/vector-icons'
import { Row, Col, Grid } from 'react-native-easy-grid'
import styles from './styles'

const { FlashMode: CameraFlashMode, Type: CameraTypes }= Camera.Constants;

export default ({
    capturing= false,
    cameraType= CameraTypes.back,
    flashMode= CameraFlashMode.off,
    setCameraType, setFlashMode,
    onCaptureIn, onCaptureOut, onLongCapture, onShortCapture
}) => (
    <Grid style= {styles.bottomToolbar}>
        <Row>
            <Col style= {styles.alignCenter}>
                <TouchableOpacity onPress= {() => setFlashMode (
                    flashMode === CameraFlashMode.off ? CameraFlashMode.on : CameraFlashMode.off
                    )}>
                    <Ionicons
                        name= {flashMode === CameraFlashMode.off ? 'md-flash' : 'md-flash-off'}
                        color= 'white'
                        size= {30}
                    />
                </TouchableOpacity>
            </Col>
            <Col size= {2} style= {style.alignCenter}>
                <TouchableWithoutFeedback
                    onPressIn= {onCaptureIn}
                    onPressOut= {onCaptureOut}
                    onLongPress= {onLongCapture}
                    onPress= {onShortCapture}>
                    <View style= {[styles.captureBtn, capturing && styles.captureBtnActive]}>
                        {capturing && <View style= {styles.captureBtnInternal} />}
                    </View>
                </TouchableWithoutFeedback>
            </Col>
            <Col style= {styles.alignCenter}>
                <TouchableOpacity onPress= {() => setCameraType(
                    cameraType === CameraTypes.back ? CameraTypes.front : CameraTypes.back
                )}>
                    <Ionicons
                        name= 'md-reverse-camera'
                        color= 'white'
                        size= {30}
                    />
                </TouchableOpacity>
            </Col>
        </Row>
        <Row>
            <Text style= {styles.bottomText}>Tap for photo, hold for video</Text>
        </Row>
    </Grid>
)