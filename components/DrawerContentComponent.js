import React from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { DrawerItems } from 'react-navigation';
import { withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStorage from '../storage/AppStorage';
import ItemAdd from '../screens/start/ItemAdd';
import { SQLiteWrapper, delayedAlert, HProWS, formatCurrency } from 'hpro-rn/';

class DrawerContentComponent extends React.Component {

    constructor(props) {
        super(props);

        this.colors = this.props.theme.colors;
    }

    state = {
        loading: true,
    }

    _addList = async() => {
        await SQLiteWrapper.executeSqlAsync('insert into hlis (des) values (?)', ['Nova Lista']);
    }

    render() {
        return (
            <ScrollView>
                <SafeAreaView style={styles.container}>
                    <View style={[{ backgroundColor: this.colors.primary }, styles.header]}>
                        <View style={styles.headerText}>
                            <Text style={styles.userNameText}>Listas </Text>
                        </View>
                    </View>
                    <DrawerItems {...this.props} />
                    
                </SafeAreaView>
                
            </ScrollView>
        );
    }
}

export default withTheme(DrawerContentComponent);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...Platform.select({
            ios: {
                // Não é necessário uma vez que o SafeAreaView faz esse papel.
            },
            android: {
                paddingTop: Expo.Constants.statusBarHeight,
            },
        })
    },
    header: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    headerText: {
        paddingLeft: 16,     
    },
    userNameText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
        fontSize: 20,
        fontFamily: 'monospace'
    },
    companyNameText: {
        fontSize: 14,
        color: 'white',
    },
    redBox: {
        backgroundColor: 'white', 
        borderRadius: 5, 
        width: 30, 
        height: 30, 
        marginRight: 10,
    }
});