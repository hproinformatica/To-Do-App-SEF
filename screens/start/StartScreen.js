import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Appbar, FAB, Portal } from 'react-native-paper';
import NavigationService from '../../navigation/NavigationService';
import Loader from '../../components/Loader';
import { SQLiteWrapper, delayedAlert, HProWS, formatCurrency } from 'hpro-rn/';
import AppStorage from '../../storage/AppStorage';
import { ScrollView } from 'react-native-gesture-handler';
import ItemTodo from './ItemTodo';
import ItemAdd from './ItemAdd';
import Icon from 'react-native-vector-icons'
import * as FileSystem from 'expo-file-system';


export default class StartScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: (
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="To-do" />
                </Appbar.Header>
            ),
            gesturesEnabled: false,
        }
    }

    state = {
        loading: false,
        adding: false,
        items: []
    }

    _loadTodo = async () => {	
        this._refresh()
    }

    _refresh = async () => {
        var resultSet = await SQLiteWrapper.executeSqlAsync('select * from htod where lis = ?', [this.props.navigation.getParam('id')]);
        this.setState({items: resultSet.rows._array})
    }

    _onWillFocus = async () => {
        this._loadTodo()
    }

    _onHide = async(text) => {
        if (text){
            await SQLiteWrapper.executeSqlAsync('insert into htod (des,lis) values (?,?)', [text,this.props.navigation.getParam('id')]);
            this._refresh()
        }  
        this.setState({adding: false});
    }

    _deleteItem = async (id) => {
        await SQLiteWrapper.executeSqlAsync('delete from htod where lis = ? and id = ?', [this.props.navigation.getParam('id'),id]);
        let toURI = `${FileSystem.documentDirectory}${this.props.navigation.getParam('id')}${id}.jpg`;
        await FileSystem.deleteAsync(toURI, {idempotent: true})
        this._refresh()
    }

    render() {
        PortalContext = (
            this.state.adding ?     
                <ItemAdd label='To-do' onHide={this._onHide.bind(this)}/>    
            : null
        )
        return (
            <View style={styles.container}>
                <NavigationEvents onWillFocus={this._onWillFocus} onDidFocus={this._onDidFocus} />
                <Loader visible={this.state.loading} />

                
                <FlatList
                    style={{marginBottom: 15}}
                    data={this.state.items}
                    renderItem={({ item }) => 
                    <ItemTodo
                        desc={item.des}
                        id={item.id}
                        idlis={item.lis}
                        checked={item.chk}
                        key={ item.id.toString() }
                        deleteItem={this._deleteItem.bind(this)}
                    />
                    }
                    keyExtractor={item => item.id.toString()}
                />  
              

                {PortalContext}

                <FAB
                    style={styles.fab}
                    large
                    icon="add"
                    onPress={() => this.setState({adding: true})}
                /> 
            </View>  
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#e3e3e3'
    },
    texto: {
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
