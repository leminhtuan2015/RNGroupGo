import React from 'react';
import {
    View,
    Text, ListView, StyleSheet,
} from "react-native"

import {
    List,
    ListItem,
} from 'react-native-elements'

import AvatarCustom from "../views/AvatarCustom"
import BaseViewScreen from "./BaseViewScreen"
import * as ActionTypes from "../../constants/ActionTypes"

class FriendViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            users: [],
            userDataSource: this.ds.cloneWithRows([]),
        }
    }

    onPressListItem = (rowData) => {
        const friendUserId = rowData.key
        this.requestShareLocation(friendUserId, rowData)
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

    renderText = () => {
        return(
            <View style={styles.text}>
                <Text style={{fontSize: 16, marginTop: 30, color: "#BDBDBD"}}>
                    Currently, there are no communication yet
                </Text>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.users.length ? this.renderListView() : this.renderText()}
            </View>
        );
    }

    componentWillReceiveProps = (newProps) => {
        // console.log("Contact will receive props :" + JSON.stringify(this.props))

        this.setState({
            users: newProps.store.userState.friendsHistory,
            userDataSource: this.ds.cloneWithRows(newProps.store.userState.friendsHistory),
        })
    }

    componentDidMount = () => {
        let currentUser = this.props.store.userState.currentUser

        if(currentUser){
            this.props.dispatch({type: ActionTypes.SAGA_GET_USER_FROM_HISTORY,
                data: {uid: currentUser.uid}})
        }

        this.props.navigation.setParams({headerTitle: "History"})
    }
}

export default FriendViewScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },

    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 20,
    },

    text: {
        justifyContent: 'center',
        alignItems: "center",
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



