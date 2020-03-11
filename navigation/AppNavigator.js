import React from 'react';
import {
    createSwitchNavigator,
    createDrawerNavigator,
    createStackNavigator,
    StackViewTransitionConfigs
} from 'react-navigation';
import { SQLiteWrapper, delayedAlert, HProWS, formatCurrency } from 'hpro-rn/';
import DrawerContentComponent from '../components/DrawerContentComponent';
import AuthLoadingScreen from '../screens/auth/AuthLoadingScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import StartScreen from '../screens/start/StartScreen';
import ListScreen from '../screens/start/ListScreen';
import CameraScreen from '../screens/start/CameraScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ServerSettingsScreen from '../screens/settings/ServerSettingsScreen';
import Theme from '../screens/start/Theme';

import { FontAwesome } from '@expo/vector-icons';

_getStacks = async() => {
    var resultSet = await SQLiteWrapper.executeSqlAsync('select * from hlis');
    //resultObjects = (resultSet.rows._array)
    return resultSet
}

const mainStacks = _getStacks();

const AuthStack = createStackNavigator( 
    {
        AuthScreen: AuthScreen,
        AuthServerSettingsScreen: ServerSettingsScreen,
    },
)

const ThemeStack = createStackNavigator( 
    {
        Theme: Theme
    }
)

const AuthNavigator = createSwitchNavigator(
    {
        AuthLoadingScreen: AuthLoadingScreen,
        AuthStack: AuthStack,
    },
    {
        initialRouteName: 'AuthLoadingScreen',
    }
);

const StartScreenStack = createStackNavigator(
    {
        ListScreen: ListScreen,
        StartScreen : StartScreen,
        CameraScreen: CameraScreen
    },
    {
        initialRouteName: 'ListScreen'
    }
);


const SettingsStack = createStackNavigator(
    {
        SettingsScreen: SettingsScreen,
        ServerSettingsScreen: ServerSettingsScreen,
    },
    {
        initialRouteName: 'SettingsScreen',
    }
);

const MainNavigator = createDrawerNavigator(
    {
        ScheduleScreenStack: {
            screen: StartScreenStack,
            navigationOptions: {
                drawerLabel: 'To-do',
                drawerIcon: ({ tintColor }) => (
                    <FontAwesome name="clipboard" size={22} color={tintColor} />
                ),
            }
        },
        ThemeStack: {
            screen: ThemeStack,
        }
    },
    {
        initialRouteName: 'ScheduleScreenStack',
        contentComponent: DrawerContentComponent,
        contentOptions: {
            activeTintColor: '#00a099',
        }
    }
);

const AppNavigator = createSwitchNavigator(
    {
        AuthNavigator: AuthNavigator,
        MainNavigator: MainNavigator,
    },
    {
        initialRouteName: 'MainNavigator',
    }
);

export default AppNavigator;