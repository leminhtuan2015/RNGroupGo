import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';

import {
    FormInput,
    List,
    ListItem,
} from 'react-native-elements'

import * as ActionTypes from "../../constants/ActionTypes"
import NavBarItem from "../views/NavBarItem"

class ContactViewScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;

        const headerLeft =
            <NavBarItem
                iconName="times"
                color="gray"
                onPress={() => {
                    navigation.goBack()
                }}/>

        return {
            drawerLabel: 'Contacts',
            tabBarLabel: 'Contacts',
            headerLeft: headerLeft,
        }
    };

    constructor(props) {
        super(props)

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            userDataSource: this.ds.cloneWithRows([]),
        }
    }

    onPressListItem = (rowData) => {
        //this.props.navigation.goBack()
        //this.props.navigation.navigate("MapView")
        const friendUserId = rowData.key
        this.requestShareLocation(friendUserId)
    }

    onTextChange = (text) => {
        console.log("dispatch filter user..........")
        this.props.dispatch({type: ActionTypes.SAGA_FIREBASE_FILTER_USER, data: text})
    }

    requestShareLocation = (friendUserId) =>{
        this.props.navigation.navigate("RequestingLocationView", {friendUserId: friendUserId})
    }

    renderRow = (rowData, sectionID) => {
        return (
            <ListItem
                onPress={() => {
                    this.onPressListItem(rowData)
                }}

                roundAvatar
                avatar={{uri: rowData.photoURL}}
                underlayColor="#bdbdbd"
                titleStyle={{color: "green", fontSize: 24}}
                subtitleStyle={{color: "blue", fontSize: 16}}
                title={rowData.name}
                subtitle={rowData.name}
            />
        )
    }

    componentWillReceiveProps = (newProps) => {
        console.log("Contact will receive props :" + JSON.stringify(this.props))

        this.setState({
            userDataSource: this.ds.cloneWithRows(newProps.store.userState.filterUsers),
        })
    }

    render() {
        return (
            <TouchableWithoutFeedback id="container" style={styles.container} onPress={() => Keyboard.dismiss()}>
                <View id="contentContainer" style={styles.contentContainer}>
                    <FormInput
                        inputStyle={{color: "#2196f3", marginLeft: 20}}
                        containerStyle={{backgroundColor: "#fafafa", borderRadius: 25}}
                        ref={(input) => {
                            this.input = input
                        }}
                        onChangeText={(text) => {
                            this.onTextChange(text)
                        }}
                        placeholder="Name"
                        autoCorrect={false}
                        defaultValue=""/>

                    <Text/>

                    <View style={{flex: 1}}>
                        <List
                            style={{flex: 1,}}
                            enableEmptySections={true}
                            containerStyle={{
                                borderBottomColor: "#ffffff",
                                borderBottomWidth: 0,
                                borderTopWidth: 1,
                            }}>
                            <ListView
                                enableEmptySections={true}
                                renderRow={this.renderRow}
                                dataSource={this.state.userDataSource}/>
                        </List>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default ContactViewScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
    },

    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 5,
    },

    button: {
        alignItems: 'center',
    },

    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
})

