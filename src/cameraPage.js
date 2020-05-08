import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import styles from './styles'
import Toolbar from './toolbar'
import Gallery from './gallery'
import * as MediaLibrary from 'expo-media-library'

export default class CameraPage extends Component {

    camera= null;

    state= {
        captures: [],
        flashMode: Camera.Constants.FlashMode.off,
        capturing: null,
        cameraType: Camera.Constants.Type.back,
        hasCameraPermission: null
    }

    setFlashMode= (flashMode) => this.setState({flashMode});
    setCameraType= (cameraType) => this.setState({cameraType});
    
    handleCaptureIn= () => this.setState({capturing: true});

    handleCaptureOut= () => {
        if (this.state.capturing) {
            this.camera.stopRecording();
        }
    };

    async  componentDidMount() {
        const camera= await Permissions.askAsync(Permissions.CAMERA);
        const audio= await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        const saveCapture= await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const hasCameraPermission= (camera.status === 'granted' && audio.status === 'granted' && saveCapture.status === 'granted');

        this.setState({hasCameraPermission});
    };

    handleShortCapture= async () => {
        console.log('tpaca');
        const pictureData= await this.camera.takePictureAsync();
        this.setState({capturing: false, captures: [pictureData, ...this.state.captures]});
        const { uri }= pictureData;
        const asset= await MediaLibrary.createAssetAsync(uri);
        MediaLibrary.createAlbumAsync('Sewa', asset)
            .then(() => {
                console.log('Album created!')
            })
            .catch(error => {
                console.log('An Error Occurred!')
            }); 
    };

    handleLongCapture= async () => {
        console.log('tpaca2');
        const videoData= await this.camera.recordAsync();
        const { uri } = videoData;
        this.setState({capturing: false, captures: [videoData, ...this.state.captures]});
        const assetVideo= await MediaLibrary.createAssetAsync(uri);
        MediaLibrary.createAlbumAsync('Sewa Videos', assetVideo)
            .then(() => {
                console.log('video album created!')
            })
            .catch(error => {
                console.log(error)
            });
    };

    render() {
        const { hasCameraPermission, flashMode, cameraType, capturing, captures } = this.state;

        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>Camera permission denied</Text>;
        }

        return (
            <React.Fragment>
                <View>
                    <Camera
                        type= {cameraType}
                        flashMode= {flashMode}
                        style= {styles.preview}
                        ref= {camera => this.camera= camera}
                    />
                </View>

                {captures.length > 0 && <Gallery captures= {captures}/>}

                <Toolbar
                    capturing= {capturing}
                    flashMode= {flashMode}
                    cameraType= {cameraType}
                    setCameraType= {this.setCameraType}
                    setFlashMode= {this.setFlashMode}
                    onCaptureIn= {this.handleCaptureIn}
                    onCaptureOut= {this.handleCaptureOut}
                    onLongCapture= {this.handleLongCapture}
                    onShortCapture= {this.handleShortCapture}
                />
            </React.Fragment>
        );
    };
}

