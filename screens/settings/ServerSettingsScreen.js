import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    KeyboardAvoidingView,
} from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';

import NavigationService from '../../navigation/NavigationService';
import AppStorage from '../../storage/AppStorage';
import { HProWS } from 'hpro-rn';

export default class ServerSettingsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: (
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Servidor" />
                    <Appbar.Action icon="done" onPress={navigation.getParam('onSaveButtonClick')} />
                </Appbar.Header>
            ),
            gesturesEnabled: false,
        }
    }

    state = {
        IPAddress: '',
        port: '',
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        // Deixa as funções de retorno de tela e salvar disponíveis para os botões do header
        this.props.navigation.setParams({ onGoBackButtonClick: this._onGoBackButtonClick, onSaveButtonClick: this._onSaveButtonClick });

        // Procura se existe alguma configuração pré-salva no dispositivo
        const initialState = await AppStorage.loadServerSettings();

        // Carrega a configuração pré-salva caso exista
        if (initialState) {
            this.setState(initialState);
        }
    }

    componentWillUnmount() {
        // Limpando os parâmetros do navigator definidos na construção desta tela
        this.props.navigation.setParams({ onGoBackButtonClick: null, onSaveButtonClick: null, returnToAuthScreen: null });
    }

    /*
    _onGoBackButtonClick = () => {
        const returnToAuthScreen = this.props.navigation.getParam('returnToAuthScreen');

        if (returnToAuthScreen) {
            NavigationService.navigate('AuthScreen');
        } else {
            this.props.navigation.goBack();
        }
    }
    */

    _onSaveButtonClick = async () => {
        await AppStorage.saveServerSettings(this.state.IPAddress, this.state.port);

        // Configura a HProRN com o IP do servidor
        HProWS.setServerIPAddress(this.state.IPAddress, this.state.port);

        this.props.navigation.goBack();
    };

    render() {
        return (
            <KeyboardAvoidingView
                style={styles.wrapper}
                behavior="padding"
            >
                <ScrollView style={styles.container}>
                    <TextInput
                        mode="flat"
                        style={styles.inputContainerStyle}
                        label="Endereço IP"
                        value={this.state.IPAddress}
                        onChangeText={IPAddress => this.setState({ IPAddress })}
                        returnKeyType={"next"}
                        onSubmitEditing={() => { this.portTextInput.focus() }}
                        blurOnSubmit={false}
                    />
                    <TextInput
                        mode="flat"
                        keyboardType="numeric"
                        style={styles.inputContainerStyle}
                        label="Porta"
                        value={this.state.port}
                        onChangeText={port => this.setState({ port })}
                        ref={input => { this.portTextInput = input; }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 8,
    },
    inputContainerStyle: {
        margin: 8,
    },
});