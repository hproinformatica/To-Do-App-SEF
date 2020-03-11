import React from "react";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    View,
    StyleSheet,
    Text,
    TouchableWithoutFeedback
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import Loader from '../../components/Loader';
import NavigationService from '../../navigation/NavigationService';
import AppStorage from '../../storage/AppStorage';
import { resetDatabaseStructure } from '../../sync/Sync';
import {
    HProWS,
    delayedAlert
} from 'hpro-rn';

export default class AuthScreen extends React.Component {

    static navigationOptions = {
        drawerLockMode: 'locked-closed',
        gesturesEnabled: false,
        header: null,
    };

    state = {
        authenticating: false,
        userName: '',
        userPassword: '',
    }

    constructor(props) {
        super(props);
    }

    _onAuthButtonPress = async () => {
        try {
            this.setState({ authenticating: true });
    
            NavigationService.navigate('MainNavigator');

        } catch (error) {
            this.setState({ authenticating: false });

            delayedAlert('Error', error.message);
        }
    }

    _onConfigButtonPress = () => {
        NavigationService.navigate('AuthServerSettingsScreen');
    }

    render() {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View
                        style={styles.container}
                    >
                        <Loader visible={this.state.authenticating} />
                        <View style={styles.logoContainer}>
                            <Image source={require('../../assets/images/logo.png')} resizeMode="contain" style={styles.logo} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                mode="flat"
                                style={styles.inputStyle}
                                label="Usuário"
                                value={this.state.userName}
                                onChangeText={userName => this.setState({ userName })}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.userPasswordTextInput.focus() }}
                                blurOnSubmit={false}
                            />
                            <TextInput
                                mode="flat"
                                secureTextEntry={true}
                                style={styles.inputStyle}
                                label="Senha"
                                value={this.state.userPassword}
                                onChangeText={userPassword => this.setState({ userPassword })}
                                ref={input => { this.userPasswordTextInput = input; }}
                            />
                            <Button
                                mode="contained"
                                icon="person"
                                onPress={this._onAuthButtonPress}
                                style={styles.authButtonStyle}
                            >
                                Autenticar usuário
                            </Button>
                        </View>
                        <View style={styles.configContainer}>
                            <Button
                                mode="text"
                                icon="settings"
                                onPress={this._onConfigButtonPress}
                            >
                                Configurar Servidor
                            </Button>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    logoContainer: {
        flexGrow: 2,
    },
    logo: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
    inputContainer: {
        flexGrow: 1,
    },
    inputStyle: {
        margin: 5,
    },
    authButtonStyle: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
    },
});