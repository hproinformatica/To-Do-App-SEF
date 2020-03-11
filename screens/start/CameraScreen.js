import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Appbar, ActivityIndicator } from 'react-native-paper';
import NavigationService from '../../navigation/NavigationService';
import Loader from '../../components/Loader';
import { SQLiteWrapper, delayedAlert, HProWS, formatCurrency } from 'hpro-rn/';
import AppStorage from '../../storage/AppStorage';
import {Camera} from 'expo-camera';
import * as Permissions from 'expo-permissions'
import * as FileSystem from 'expo-file-system';

const type = Camera.Constants.Type.back;
let hashImage

export default class CameraScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: (
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Anexar foto" />
                </Appbar.Header>
            ),
            gesturesEnabled: false,
        }
    }

    state = {
        loading: false,
    }

    _getURI = () => {
        return `${FileSystem.documentDirectory}${this.props.navigation.getParam('lis')}${this.props.navigation.getParam('id')}.jpg`;
    }

    UNSAFE_componentWillMount = async () => {
        hashImage = Math.random().toString() 
        let info = await FileSystem.getInfoAsync(this._getURI())
        if (info.exists == true){
            this.setState({exists: (info.exists == true), uri: this._getURI()})
        }
    }

    componentDidMount = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
    }

    _takePic = async() => {
        this.setState({loading: true})
        await this.camera.takePictureAsync({onPictureSaved: this.onPictureSaved, skipProcessing: true, quality: 0})
    }

    onPictureSaved = async photo => {
        let photoURI = photo.uri;
        this.setState({exists: true, uri: photoURI})
        let toURI = `${FileSystem.documentDirectory}${this.props.navigation.getParam('lis')}${this.props.navigation.getParam('id')}.jpg`;
        await FileSystem.deleteAsync(toURI, {idempotent: true})
        await FileSystem.copyAsync({from: photoURI, to: toURI})
        await this.props.navigation.goBack()
        //this.setState({loading: false})
    }

    render() {  
        return (
            <View style={styles.container}>
                <NavigationEvents onWillFocus={this._onWillFocus} onDidFocus={this._onDidFocus} />
                    {
                        this.state.exists ?
                        <View>
                            <Image 
                                source={{uri: this.state.uri +'?time'+hashImage, headers: {Pragma: 'no-cache' }}}
                                style={{height: '90%'}}     
                            />
                            <View style={styles.helper}>     
                                <TouchableOpacity onPress={() => this.setState({exists: false})}>                     
                                    <Text style={{fontSize: 20}}>Toque para tirar outra foto</Text>    
                                </TouchableOpacity>                             
                            </View> 
                        </View>
                        :
                        <View>
                            <Camera 
                                style={{ height: '90%' }} 
                                type={type}
                                ref={ref => {
                                    this.camera = ref;
                                }}
                            >
                                <TouchableOpacity style={{ flex: 1 }} onPress={this._takePic}/>
                            </Camera>

                            <View style={styles.helper}>
                                {
                                this.state.loading ?
                                    <View style={{ flexDirection: 'row', marginBottom: 5}}>
                                        <Text style={{fontSize: 20}}>Aguarde </Text>
                                        <ActivityIndicator animating={this.state.loading} color={'#00a099'} />
                                    </View>
                                :
                                    
                                    <Text style={{fontSize: 20}}>Toque para tirar uma foto</Text>
                                }
                            </View> 
                        </View>
                    }             
            </View>  
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#657890',
    },
    helper: {
        flexDirection: 'row', 
        height: '10%', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'white'
    }
});
