import React from 'react';
import { StyleSheet, View, Text, FlatList, Animated, KeyboardEvent, Keyboard } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Appbar, FAB, Checkbox, Button } from 'react-native-paper';
import NavigationService from '../../navigation/NavigationService';
import { SQLiteWrapper, delayedAlert, HProWS, formatCurrency } from 'hpro-rn/';
import { TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class ListItem extends React.Component {

    constructor(props){
        super(props)
    }

    state = {
        left: new Animated.Value(1000),
        showDelete: new Animated.Value(0),
        showDelete: false
    }

    componentDidMount = () => {
        Animated.sequence([
            Animated.delay(500),
            Animated.spring(
                this.state.left,
                {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true 
                }
            )
        ]).start(() => this.setState({showDelete: true}))
    }

    _onDelete = () => {
        this.setState({tilted: true})
        Animated.spring(
            this.state.left,
            {
                toValue: -55,
                duration: 300,
                useNativeDriver: true 
            }
        ).start()   
    }

    _onGoBack = (isDelete) => {
        if (!this.state.tilted){
            NavigationService.navigate('StartScreen', {id: this.props.id});
        } else {
            Animated.spring(
                this.state.left,
                {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true 
                }
            ).start(() => isDelete? this.props.deleteItem(this.props.id) : this.setState({tilted: false}))       
        }
    }

    _deleteItem = () => {
        this._onGoBack(true)
    }

    render() {
        return (
            <View>
                <NavigationEvents onWillFocus={this._onWillFocus} onDidFocus={this._onDidFocus} />
                <TouchableWithoutFeedback onPress={this._onGoBack} onLongPress={this._onDelete}>
                    <Animated.View style={{flexDirection: 'row', translateX: this.state.left, zIndex: 2}}>
                    
                        <View style={{...styles.card, left: 0}}>                           
                            <Text style={styles.normal}>{this.props.desc}</Text>                           
                        </View>
                    
                    </Animated.View>
                    <View style={{zIndex: 1, flex: 1, flexDirection: 'row-reverse', marginLeft: 15}}>
                        { this.state.showDelete ?                          
                            <View style={styles.redBox} >  
                                <TouchableOpacity style={{height: 50, width: 50,}} onPress={this._deleteItem} > 
                                    <View style={{height: 50, width: 50, alignItems: 'center', justifyContent: 'center',}}>
                                        <Icon color='white' name="times-circle" size={25} /> 
                                    </View>
                                </TouchableOpacity>                            
                            </View>                    
                            :
                            null
                        }    
                    </View>
                </TouchableWithoutFeedback>        
            </View>  
        );
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 15,
        minHeight: 50,
        borderRadius: 5,
        backgroundColor: 'white'
    },
    normal: {
        fontSize: 18, 
        fontFamily: 'monospace', 
        fontWeight:'bold',
        marginLeft: 10,
        marginRight: 30,
    },
    striked: {
        fontSize: 18, 
        fontFamily: 'monospace', 
        marginLeft: 10,
        marginRight: 30,
        textDecorationLine: 'line-through', 
        textDecorationStyle: 'solid'
    },
    redBox: {
        backgroundColor: '#e50000', 
        borderRadius: 5, 
        width: 50, 
        height: 49, 
        marginTop: -50,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
