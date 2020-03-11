import React from 'react';
import {
    Alert,
    Text,
    ScrollView,
    View,
    StyleSheet,
} from 'react-native';
import { Appbar, Divider, TouchableRipple } from 'react-native-paper';

import NavigationService from '../../navigation/NavigationService';
import AppStorage from '../../storage/AppStorage';
import Loader from '../../components/Loader';
import { syncApp, resetDatabaseStructure } from '../../sync/Sync';

export default class SettingsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: (
                <Appbar.Header>
                    <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
                    <Appbar.Content title="Configurações" />
                </Appbar.Header>
            ),
            gesturesEnabled: false,
        }
    }

    state = {
        loading: true,
    }

    syncInfoDate = '';
    syncInfoTime = ''; 

    constructor(props) {
        super(props);
    }


    async componentDidMount() {
        const syncInfo = await AppStorage.loadSyncInfo();
        if (syncInfo) {
            this.syncInfoDate = syncInfo.date;
            this.syncInfoTime = syncInfo.time;
        }

        this.setState({ loading: false });
    }

    _onServerButtonClick = () => {
        NavigationService.navigate('ServerSettingsScreen');
    }

    _onRemoveUserButtonClick = () => {
        // Get the app's root navigator
        Alert.alert(
            'Remover usuário autenticado',
            'Toda informação não enviada ao PH2 será apagada. Deseja continuar?',
            [
                { text: 'Não', onPress: null, style: 'cancel' },
                { text: 'Sim', onPress: this._removeUser },
            ],
        );
    }

    _onSynchronizeDatabaseButtonClick = async () => {
        this.setState({ loading: true });

        await syncApp();
        
        const syncInfo = await AppStorage.loadSyncInfo();
        if (syncInfo) {
            this.syncInfoDate = syncInfo.date;
            this.syncInfoTime = syncInfo.time;
        }

        this.setState({ loading: false });
    }

    _removeUser = async () => {

        // Limpando os dados e recriando estrutura do banco de dados
        await resetDatabaseStructure();

        // Limpando dados de sincronização
        await AppStorage.clearSyncInfo();

        // Limpando dados do usuário
        await AppStorage.clearUserInfo();

        // Navigate to authentication screen
        NavigationService.navigate('AuthScreen');
    }

    render() {
        return (
            <ScrollView>
                <Loader visible={this.state.loading} />
                <TouchableRipple onPress={this._onServerButtonClick} style={styles.itemContainer}>
                    <View>
                        <Text style={styles.settingsItem}>
                            Servidor
                        </Text>
                    </View>
                </TouchableRipple>
                <Divider />
                <TouchableRipple onPress={this._onRemoveUserButtonClick} style={styles.itemContainer}>
                    <View>
                        <Text style={styles.settingsItem}>
                            Remover usuário autenticado
                        </Text>
                    </View>
                </TouchableRipple>
                <Divider />
                <TouchableRipple onPress={this._onSynchronizeDatabaseButtonClick} style={styles.itemContainer}>
                    <View>
                        <Text style={styles.settingsItem}>
                            Sincronizar base de dados
                        </Text>
                        <Text style={styles.syncInfo}>
                            Última sincronização: {this.syncInfoDate ? `${this.syncInfoDate} às ${this.syncInfoTime}.` : 'aplicativo não sincronizado.'}
                        </Text>
                    </View>
                </TouchableRipple>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        padding: 16,
    },
    settingsItem: {
        fontSize: 16,
    },
    syncInfo: {
        marginTop: 4,
        fontSize: 12,
        color: 'rgba(0, 0, 0, 0.60)',
    }
});
