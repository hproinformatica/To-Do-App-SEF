import React from 'react';
import { StyleSheet, View, Text, FlatList, Animated, Image } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import NavigationService from '../../navigation/NavigationService';
import ThemeService from '../../navigation/ThemeService'
import { Appbar, FAB, Checkbox, Button, DefaultTheme } from 'react-native-paper';
import { SQLiteWrapper, delayedAlert, HProWS, formatCurrency } from 'hpro-rn/';
import { TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';

var hashImage

export default class ItemTodo extends React.Component {

    constructor(props){
        super(props)
    }  

    state = {
        left: new Animated.Value(1000),
        showDelete: new Animated.Value(0),
        checked: this.props.checked,
        showDelete: false,
        hasImage: false
    }

    _refresh = async () => {  
        hashImage = Math.random().toString() 
        let uri = this._getURI()
        let info = await FileSystem.getInfoAsync(uri)
        if ((info.exists == true) != this.state.hasImage){
            this.setState({hasImage: info.exists == true})
        }
    }

    onWillFocus = () => {
        this._refresh()
    }

    UNSAFE_componentWillMount = async () => { 
        this._refresh()
    }

    _getURI = () => {
        return `${FileSystem.documentDirectory}${this.props.idlis}${this.props.id}.jpg`;
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
        Animated.timing(
            this.state.left,
            {
                toValue: -55,
                duration: 300,
                useNativeDriver: true 
            }
        ).start()       
    }

    _onGoBack = (isDelete) => {
        Animated.spring(
            this.state.left,
            {
                toValue: 0,
                duration: 300,
                useNativeDriver: true 
            }
        ).start(() => isDelete? this.props.deleteItem(this.props.id) : null)       
    }

    _deleteItem = () => {
        this._onGoBack(true)
    }

    _checkItem = async () => {
        var aux = (this.state.checked == 0) ? 1 : 0
        this.setState({checked: aux})
        await SQLiteWrapper.executeSqlAsync('update htod set chk = ? where id = ?', [aux, this.props.id]);
    }

    render() {
        return (
            <View>
                <NavigationEvents onWillFocus={this.onWillFocus} onDidFocus={this._onDidFocus} />
                <TouchableWithoutFeedback onPress={this._onGoBack} onLongPress={this._onDelete}>
                    <Animated.View style={{flexDirection: 'row', translateX: this.state.left, zIndex: 2}}>
                    
                        <View style={{...styles.card, left: 0}}>
                            <View style={{marginLeft: 20}}>
                                <Checkbox
                                    status={(this.state.checked == 1) ? 'checked' : 'unchecked'}
                                    onPress={this._checkItem}
                                />
                            </View>
                            <View style={{marginRight: 25}}>
                                {
                                    (this.state.checked == 1) ?
                                    <Text style={styles.striked}>{this.props.desc}</Text>
                                :
                                    <Text style={styles.normal}>{this.props.desc}</Text>
                                }
                            </View>
                            
                            <View style={{flex: 1, flexDirection: 'row-reverse', marginLeft: 10, alignItems: 'center'}}>    
                                <TouchableWithoutFeedback onPress={() => NavigationService.navigate('CameraScreen', {id: this.props.id, lis: this.props.idlis})}>
                                    { this.state.hasImage ?
                                        <Image 
                                            source={{uri: this._getURI() +'?time'+hashImage, headers: {Pragma: 'no-cache' }}}
                                            style={{width: 100, height: 100, borderRadius: 4, marginVertical: 5}}     
                                        />
                                        :
                                        <Icon name="camera" size={20} style={{marginRight: 10}} color={ThemeService.getPrimary()} /> 
                                    }   
                                </TouchableWithoutFeedback>     
                            </View>
                        
                        </View>
                        
                        
                    
                    </Animated.View>
                    <View style={{zIndex: 1, flex: 1, flexDirection: 'row-reverse', marginLeft: 15}}>
                        { this.state.showDelete ?                          
                            <View style={{...styles.redBox, height: this.state.hasImage ? 110 : 49, width: 50, marginTop: this.state.hasImage ? -110 : -50}} >  
                                <TouchableOpacity onPress={this._deleteItem} > 
                                    <View style={{height: this.state.hasImage ? 110 : 50, width: 50, alignItems: 'center', justifyContent: 'center',}}>
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
        alignItems: 'center',
        justifyContent: 'center',
    }
});
