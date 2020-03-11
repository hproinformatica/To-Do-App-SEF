import { NavigationActions } from 'react-navigation';
import { DefaultTheme } from 'react-native-paper';
import AppStorage from '../storage/AppStorage';

let _themeFunction;
let _currentTheme;

function setThemeFunction(funcRef) {
    _themeFunction = funcRef;
}

function getColor(id) {
    var cHex = '#00A6A6'
    if (id == 1){
        cHex = '#00A6A6'
    } else if (id == 2){
        cHex = '#59656F'
    } else if (id == 3){
        cHex = '#9C528B'
    } else if (id == 4){
        cHex = '#0B032D'
    } else if (id == 5){
        cHex = '#2C5784'
    } else if (id == 6){
        cHex = '#70A0AF'
    } else if (id == 7){
        cHex = '#470024'
    } else if (id == 8){
        cHex = '#F4D35E'
    } else if (id == 9){
        cHex = '#63A088'
    } else if (id == 10){
        cHex = '#E16036'
    }

    return cHex
}

function getPrimary(){
    return _currentTheme.colors.primary
}

function setTheme(id) {
    _currentTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: getColor(id),
            accent: getColor(id),
            secondary: '#575756',
            background: '#ffffff',
        }
    }
    AppStorage.saveTheme(id)
    if (_themeFunction){
        _themeFunction(_currentTheme)
    }
}

async function _getDefaultTheme (){
    return await AppStorage.loadTheme()
}

export default {
    setThemeFunction,
    setTheme,
    getColor,
    getPrimary,
    _getDefaultTheme
};