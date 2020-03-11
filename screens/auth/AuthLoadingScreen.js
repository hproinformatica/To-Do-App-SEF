import React from 'react';
import { 
    View, 
    ActivityIndicator, 
    StyleSheet 
} from 'react-native';

import NavigationService from '../../navigation/NavigationService';
import AppStorage from '../../storage/AppStorage';
import { HProWS } from 'hpro-rn';


export default class AuthLoadingScreen extends React.Component {
    
    static navigationOptions = {
        drawerLockMode: 'locked-closed',
        gesturesEnabled: false,
        header: null,
    };

    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    async _bootstrapAsync() {

        // Configura a HProRN com o IP do servidor (caso exista)
        const serverSettings = await AppStorage.loadServerSettings();
        if (serverSettings) {
            HProWS.setServerIPAddress(serverSettings.IPAddress, serverSettings.port);
        }

        const userInfo = true;
        // This will switch to the Main app screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        if (userInfo) {
            NavigationService.navigate('MainNavigator');
        } else {
            NavigationService.navigate('AuthScreen');
        }
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large'/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});