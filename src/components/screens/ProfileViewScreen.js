import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image, ListView,
} from "react-native"

import {
    Button,
    FormInput,
    List,
    ListItem,
} from 'react-native-elements'

import * as ActionTypes from "../../constants/ActionTypes"
import BaseViewScreen from "./BaseViewScreen";
import IconManager from "../../utils/IconManager";

class ProfileViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.tableData = [
            {title: "Name", value: "name"},
            {title: "Nickname", value: "nick"},
            {title: "Logout", value: " "}
        ]
        this.tableDataIcon = [
            (IconManager.icon("user-circle", "#009688")),
            (IconManager.icon("star", "#448AFF")),
            (IconManager.icon("sign-out", "#F44336")),
        ]

        this.state = {
            userInfoDataSource: this.ds.cloneWithRows(this.tableData),
        }
    }

    onPressListItem = (rowData) => {
        const title = rowData.title

        if (title == "Logout") {
            this.props.dispatch({type: ActionTypes.SAGA_USER_LOGOUT})
        }
    }

    renderLoginButtons = () => {
        return (
            <View>
                <Button
                    onPress={() => {
                        this.props.dispatch({type: ActionTypes.SAGA_FACEBOOK_LOGIN})
                    }}
                    raised
                    backgroundColor="#385691"
                    icon={{name: "facebook", type: "font-awesome"}}
                    title="Login With Facebook"/>

                <Text/>

                <Button
                    onPress={() => {
                        this.props.dispatch({type: ActionTypes.SAGA_GOOGLE_LOGIN})
                    }}
                    raised
                    backgroundColor="#DB4D40"
                    icon={{name: "google", type: "font-awesome"}}
                    title="Login With Google"/>
            </View>
        )
    }

    renderRow = (rowData, sectionID, rowID, higlightRow) => {

        console.log(" renderRow : " + rowID)

        return (
            <ListItem
                onPress={() => {
                    this.onPressListItem(rowData)
                }}

                roundAvatar
                // avatar={{uri: rowData.icon}}
                avatar={this.tableDataIcon[rowID]}
                underlayColor="#bdbdbd"
                title={rowData.title}
                rightTitle={rowData.value}

                titleStyle={{color: "#263238", fontSize: 16}}
                rightTitleStyle={{color: "gray", fontSize: 14}}
                subtitleStyle={{color: "blue", fontSize: 12}}
            />
        )
    }

    renderUser = () => {
        return (
            <View style={styles.container}>
                <View style={styles.top}>
                    <Image
                        style={styles.roundImage}
                        source={{uri: this.props.store.userState.currentUser.photoURL}}
                    />

                    <Text style={styles.userName}>
                        {this.props.store.userState.currentUser.displayName}
                    </Text>
                </View>

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
                            dataSource={this.state.userInfoDataSource}/>
                    </List>
                </View>
            </View>
        )

    }

    componentWillReceiveProps = (newProps) => {
        console.log("ProfileView will receive props : " + JSON.stringify(newProps))
    }

    render = () => {
        console.log("render_x ProfileViewScreen")

        return (
            <View style={styles.container}>
                {
                    this.props.store.userState.currentUser ?
                        this.renderUser() :
                        this.renderLoginButtons()
                }
            </View>
        )
    }

    componentDidMount = () => {
        console.log("PROFILE componentDidMount")

        this.props.dispatch({type: ActionTypes.SAGA_GET_CURRENT_USER})
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 15,
    },

    top: {
        marginTop: 0,
        alignItems: 'center',
    },

    roundImage: {
        height: 160,
        width: 160,
        borderRadius: 80,
    },

    userName: {
        marginTop: 10,
        marginLeft: 10,
        fontSize: 30,
    },

});

export default ProfileViewScreen




