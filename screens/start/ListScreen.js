import React from 'react';
import { StyleSheet, View, Text, FlatList, KeyboardAvoidingView } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Appbar, FAB, Portal, DefaultTheme } from 'react-native-paper';
import NavigationService from '../../navigation/NavigationService';
import Loader from '../../components/Loader';
import { SQLiteWrapper, delayedAlert, HProWS, formatCurrency } from 'hpro-rn/';
import AppStorage from '../../storage/AppStorage';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ItemAdd from './ItemAdd';
import Theme from './Theme';
import ListItem from './ListItem';
import Icon from 'react-native-vector-icons'

export default class ListScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: (
                <Appbar.Header>           
                    <Appbar.Content title="Listas" />
                    <Appbar.Action icon="color-lens" size={30} onPress={navigation.getParam('showTheme')} />
                </Appbar.Header>
            ),
            gesturesEnabled: false,
        }
    }

    state = {
        loading: false,
        adding: false,
        items: [],
        showTheme: false
    }

    _loadTodo = async () => {

		await SQLiteWrapper.transactionAsync(transaction => {
            //transaction.executeSql('delete from htod where id < 999');
            //transaction.executeSql('delete from hlis where id < 999');
            //transaction.executeSql('drop table if exists htod');
            transaction.executeSql('create table if not exists htod (id INTEGER PRIMARY KEY AUTOINCREMENT, des varchar(100), chk integer default 0, lis integer)');
            transaction.executeSql('create table if not exists hlis (id INTEGER PRIMARY KEY AUTOINCREMENT, des varchar(100))');
        })	
        this._refresh()
    }

    _refresh = async () => {
        var resultSet = await SQLiteWrapper.executeSqlAsync('select * from hlis');
        this.setState({items: resultSet.rows._array})

        var resultSetAux = await SQLiteWrapper.executeSqlAsync('select * from htod');
    }

    _showTheme = () => {
        this.setState({showTheme: true})
    }

    _onWillFocus = async () => {
        this.props.navigation.setParams({ showTheme: this._showTheme });
        await this._loadTodo()  
    }

    _onHide = async(text) => {
        if (text) {
            await SQLiteWrapper.executeSqlAsync('insert into hlis (des) values (?)', [text]);
            this._refresh()
        }
        this.setState({adding: false});
        
    }

    _onHideTheme = () => {
        this.setState({showTheme: false});
        
    }

    _deleteItem = async (id) => {
        await SQLiteWrapper.transactionAsync(transaction => {
            transaction.executeSql('delete from hlis where id = ?', [id]);
            transaction.executeSql('delete from htod where lis = ?', [id]);
        })
        this._refresh()
    }

    render() {
        PortalContext = (
            this.state.adding ?                   
                <ItemAdd label='Lista' onHide={this._onHide.bind(this)}/>      
            : 
                null
        )
        PortalTheme = (
            this.state.showTheme ?                   
                <Theme onHide={this._onHideTheme}/>      
            : 
                null
        )
        return (
            <View style={styles.container}>
                <NavigationEvents onWillFocus={this._onWillFocus} onDidFocus={this._onDidFocus} />
                <Loader visible={this.state.loading} />

                
                <FlatList
                    style={{marginBottom: 15}}
                    data={this.state.items}
                    renderItem={({ item }) => 
                        <ListItem 
                            id={item.id} 
                            desc={item.des} 
                            deleteItem={this._deleteItem.bind(this)}
                        />
                    }
                    keyExtractor={item => item.id.toString()}
                />  
                

                {PortalContext}

                {PortalTheme}

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
        backgroundColor: '#e3e3e3',
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
