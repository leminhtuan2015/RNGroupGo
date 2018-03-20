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

import ActivityIndicatorCustom from "../views/ActivityIndicatorCustom";

import * as ActionTypes from "../../constants/ActionTypes"
import BaseViewScreen from "./BaseViewScreen"
import AvatarCustom from "../views/AvatarCustom";
import SearchTextInput from "../views/SearchTextInput";

class ContactViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            userDataSource: this.ds.cloneWithRows([]),
        }
        this.input = null
    }

    addUserToHistory = (friendId) => {
        let currentUser = this.props.store.userState.currentUser

        if (currentUser) {
            this.props.dispatch({
                type: ActionTypes.SAGA_ADD_USER_TO_HISTORY,
                data: {uid: currentUser.uid, friendId: friendId}
            })
        } else {

        }
    }

    onPressListItem = (rowData) => {
        console.log("Contact onPressListItem user : " + JSON.stringify(rowData))

        const friendUserId = rowData.key
        this.requestShareLocation(friendUserId, rowData)
        this.addUserToHistory(friendUserId)
    }

    onTextChange = (text) => {
        console.log("Search keyword.........." + text)
        let currentUser = this.props.store.userState.currentUser

        if(!text){
            return
        }

        console.log("Searching----------" + text)

        // this.props.dispatch({
        //     type: ActionTypes.SAGA_FIREBASE_FILTER_USER,
        //     data: {keyword: text, currentUserId: currentUser.uid}
        // })

        this.props.dispatch({
            type: ActionTypes.SAGA_FIREBASE_FUNCTIONS_SEARCH_USER,
            data: {keyword: text, currentUserId: currentUser.uid}
        })
    }

    requestShareLocation = (friendUserId, friendData) => {
        this.props.navigation.navigate("RequestingLocationView",
            {friendUserId: friendUserId, friendData: friendData})
    }

    renderRow = (rowData, sectionID) => {

        let avatar = <AvatarCustom
            uri={rowData.photoURL}
            userId={rowData.key}
        />

        return (
            <ListItem
                onPress={() => {
                    this.onPressListItem(rowData)
                }}

                roundAvatar
                // avatar={{uri: rowData.photoURL}}
                avatar={avatar}
                underlayColor="#bdbdbd"

                titleStyle={{color: "#263238", fontSize: 16}}
                rightTitleStyle={{color: "gray", fontSize: 14}}
                subtitleStyle={{color: "gray", fontSize: 12}}

                title={rowData.name}
                subtitle={rowData.name}
            />
        )
    }

    renderListView = () => {
        return (
            <View style={{flex: 1}}>
                <List
                    style={{flex: 1,}}
                    enableEmptySections={true}
                    containerStyle={{
                        borderBottomColor: "#ffffff",
                        borderBottomWidth: 0,
                        borderTopWidth: 0,
                    }}>
                    <ListView
                        enableEmptySections={true}
                        renderRow={this.renderRow}
                        dataSource={this.state.userDataSource}/>
                </List>
            </View>
        )
    }

    renderTopView = () => {
        return (
            <View>
                <SearchTextInput
                    pauseDelay={1000}
                    onChangeText={(text) => {
                        console.log("Text Changed")
                    }}
                    onPauseText={(text) => {
                        this.onTextChange(text)
                    }}
                />
            </View>
        )
    }

    renderIndicator = () => {
        return (
            <ActivityIndicatorCustom/>
        )
    }

    render() {
        return (
            <TouchableWithoutFeedback
                id="container"
                style={styles.container}
                onPress={() => Keyboard.dismiss()}>

                <View id="contentContainer" style={styles.contentContainer}>
                    {this.props.store.userState.isBusy && this.renderIndicator()}
                    {this.renderTopView()}
                    {this.renderListView()}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    componentWillReceiveProps = (newProps) => {
        // console.log("Contact will receive props :" + JSON.stringify(this.props))

        this.setState({
            userDataSource: this.ds.cloneWithRows(newProps.store.userState.filterUsers),
        })
    }

    componentDidMount = () => {
        this.props.navigation.setParams({headerTitle: "Find Friend"})
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
        marginTop: 20,
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

