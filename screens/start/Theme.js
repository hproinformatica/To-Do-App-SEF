import React from 'react';
import { StyleSheet, View, Text, FlatList, Animated, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Portal, TextInput, Button } from 'react-native-paper';
import { SQLiteWrapper, delayedAlert, HProWS, formatCurrency } from 'hpro-rn/';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ThemeService from '../../navigation/ThemeService';

const ScreenHeight = Math.round(Dimensions.get('window').height);
const alturaCard = 130;
var alturaTeclado = 0;

class Theme extends React.Component {

    constructor(props){
        super(props)
    }

    state={
        tema: '',
        top: new Animated.Value(1000)
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

    _choose = (id) => {
        ThemeService.setTheme(id)
        this._onlyHide()
    }

    _onlyHide = async () => {  
        alturaTeclado = 0  
        Animated.timing(
            this.state.top,
            {
                toValue: 1000,
                duration: 100,  
                useNativeDriver: true    
            } 
        ).start(() => this.props.onHide())
    }

    render() {
        return (
            <Portal>
                
                    <View style={{height: '100%'}}>
                        <Animated.View pointerEvents='box-none' style={{flex: 1, alignItems: 'center', translateY: this.state.top}}> 
                            <View style={styles.container}>
                                <View pointerEvents='box-none' style={{margin: 5, flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this._choose(1)} style={{...styles.color, backgroundColor: ThemeService.getColor(1)}} />
                                    <TouchableOpacity onPress={() => this._choose(2)} style={{...styles.color, backgroundColor: ThemeService.getColor(2)}} />
                                    <TouchableOpacity onPress={() => this._choose(3)} style={{...styles.color, backgroundColor: ThemeService.getColor(3)}} />
                                    <TouchableOpacity onPress={() => this._choose(4)} style={{...styles.color, backgroundColor: ThemeService.getColor(4)}} />
                                    <TouchableOpacity onPress={() => this._choose(5)} style={{...styles.color, backgroundColor: ThemeService.getColor(5)}} />
                                </View>

                                <View pointerEvents='box-none' style={{margin: 5, marginTop: -5,  flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this._choose(6)} style={{...styles.color, backgroundColor: ThemeService.getColor(6)}} />
                                    <TouchableOpacity onPress={() => this._choose(7)} style={{...styles.color, backgroundColor: ThemeService.getColor(7)}} />
                                    <TouchableOpacity onPress={() => this._choose(8)} style={{...styles.color, backgroundColor: ThemeService.getColor(8)}} />
                                    <TouchableOpacity onPress={() => this._choose(9)} style={{...styles.color, backgroundColor: ThemeService.getColor(9)}} />
                                    <TouchableOpacity onPress={() => this._choose(10)} style={{...styles.color, backgroundColor: ThemeService.getColor(10)}} />
                                </View>
                               
                            </View> 
                        </Animated.View> 
                    </View>
                
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    container:{  
        backgroundColor: '#eaeaea',
        borderRadius: 5,
        height: alturaCard,
        width: 310,
        flexDirection: 'column',
    },
    color: {
        height: 50,
        width: 50,
        margin: 5,
        borderRadius: 3
    }
});

export default Theme;
