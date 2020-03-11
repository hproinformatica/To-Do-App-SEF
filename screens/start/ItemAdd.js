import React from 'react';
import { StyleSheet, View, Text, FlatList, Animated, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Portal, TextInput, Button } from 'react-native-paper';
import { SQLiteWrapper, delayedAlert, HProWS, formatCurrency } from 'hpro-rn/';
import ThemeService from '../../navigation/ThemeService'

const ScreenHeight = Math.round(Dimensions.get('window').height);
const alturaCard = 150;
var alturaTeclado = 0;

class ItemAdd extends React.Component {

    constructor(props){
        super(props)
    }

    state={
        text: '',
        top: new Animated.Value(1000)
    }

    UNSAFE_componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    
    componentWillUnmount () {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    componentDidMount = () => {
        Animated.spring(
           this.state.top,
           {
               toValue: Math.round((ScreenHeight-alturaTeclado-alturaCard)/2),
               duration: 1000,     
               useNativeDriver: true       
           } 
        ).start()
    }

    _fixKeyboard = () => {
        Animated.spring(
            this.state.top,
            {
                toValue: Math.round((ScreenHeight-alturaTeclado-alturaCard)/2),
                duration: 300,     
                useNativeDriver: true       
            }
        ).start()
    }

    _hide = async (isSave) => { 
        alturaTeclado = 0     
        this.props.onHide(this.state.text)
        Animated.timing(
            this.state.top,
            {
                toValue: 1000,
                duration: 100,  
                useNativeDriver: true    
            } 
        ).start()
    }

    _onlyHide = async (isSave) => {  
        alturaTeclado = 0  
        Animated.spring(
            this.state.top,
            {
                toValue: 1000,
                duration: 700,  
                useNativeDriver: true    
            } 
        ).start(() => this.props.onHide(null))
    }

    _keyboardDidShow () {
        alturaTeclado = 200
        this._fixKeyboard()
    }

    _keyboardDidHide () {
        alturaTeclado = 0
        this._fixKeyboard()
    }

    render() {
        return (
            <Portal>
                <TouchableWithoutFeedback onPress={this._onlyHide}>
                    <View style={{height: '100%'}}>
                        <Animated.View style={{flex: 1, alignItems: 'center', translateY: this.state.top}}> 
                            <View style={styles.container}>
                                <TextInput
                                    label={this.props.label}
                                    value={this.state.text}
                                    onChangeText={text => this.setState({ text })}
                                    style={{margin: 15}}
                                />
                                <Button  mode="contained" onPress={this._hide} style={{marginHorizontal: 20}}>
                                    SALVAR
                                </Button>
                            </View> 
                        </Animated.View> 
                    </View>
                </TouchableWithoutFeedback>
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    container:{  
        backgroundColor: '#eaeaea',
        borderRadius: 5,
        height: alturaCard,
        width: '85%',
        margin: 20
    }
});

export default ItemAdd;
