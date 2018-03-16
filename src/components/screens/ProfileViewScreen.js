import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image, ListView,
    ScrollView,
} from "react-native"

import {
    Button,
    List,
    ListItem,
} from 'react-native-elements'

import DialogBox from "react-native-dialogbox"
import * as ActionTypes from "../../constants/ActionTypes"
import BaseViewScreen from "./BaseViewScreen"
import IconManager from "../../utils/IconManager"
import ActivityIndicatorCustom from "../views/ActivityIndicatorCustom";

class ProfileViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.tableData = [
            {title: "Name", value: " "},
            {title: "Nickname", value: " "},
            {title: "Email", value: " "},
            {title: "Phone", value: " "},
            {title: "Logout", value: " "}
        ]

        this.tableDataIcon = [
            (IconManager.icon("user-circle", 30, "#009688")),
            (IconManager.icon("star", 30, "#448AFF")),
            (IconManager.icon("envelope-square", 30, "#FFD600")),
            (IconManager.icon("phone-square", 30, "#311B92")),
            (IconManager.icon("sign-out", 30, "#F44336")),
        ]

        this.userInfoDataSource = this.ds.cloneWithRows(this.tableData)
        this.currentUser = null
        this.dialogbox = null
    }

    updateTableData = (user) => {
        if(!user){return}

        this.tableData[0]["value"] = user.displayName
        this.tableData[1]["value"] = user.nickName
        this.tableData[2]["value"] = user.email
        this.tableData[3]["value"] = user.phoneNumber
    }

    handleLogoutPressed = () => {
        this.dialogbox.confirm({
            title: "Would you like to logout?",
            content: [""],
            ok: {
                text: "Yes",
                style: {
                    color: "red"
                },
                callback: () => {
                    // this.dialogbox.alert("Good!");
                    this.props.dispatch({type: ActionTypes.SAGA_USER_LOGOUT})
                },
            },
            cancel: {
                text: "No",
                style: {
                    color: "green"
                },
                callback: () => {
                    // this.dialogbox.alert('Hurry up！');
                },
            },
        });
    }

    goToUpdateProfile = () => {
        this.props.navigation.navigate("UpdateProfileView", {currentUser: this.currentUser})
    }

    onPressListItem = (rowData) => {
        const title = rowData.title

        if (title == this.tableData[4]["title"]) {
            this.handleLogoutPressed()
        } else {
            this.goToUpdateProfile()
        }
    }

    renderLoginButtons = () => {
        return (
            <View style={styles.loginButtons}>
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
                subtitleStyle={{color: "gray", fontSize: 12}}
            />
        )
    }

    renderIndicator = () => {
        return(
            <ActivityIndicatorCustom />
        )
    }

    renderUser = () => {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.top}>
                        <Image
                            style={styles.roundImage}
                            source={{uri: this.currentUser.photoURL}}
                        />

                        <Text style={styles.userName}>
                            {this.currentUser.displayName}
                        </Text>
                    </View>

                    <View>
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
                                dataSource={this.userInfoDataSource}/>
                        </List>
                    </View>
                </ScrollView>

                <DialogBox ref={dialogbox => {
                    this.dialogbox = dialogbox
                }}/>
            </View>
        )

    }

    render = () => {
        console.log("render_x ProfileViewScreen")

        return (
            <View style={styles.container}>
                {this.props.store.userState.isBusy && this.renderIndicator()}

                {
                    this.currentUser ?
                        this.renderUser() :
                        this.renderLoginButtons()
                }
            </View>
        )
    }

    componentWillReceiveProps = (newProps) => {
        console.log("ProfileView will receive props : " + JSON.stringify(newProps))

        this.currentUser = newProps.store.userState.currentUser
        this.updateTableData(this.currentUser)
        this.userInfoDataSource = this.ds.cloneWithRows(this.tableData)

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
        marginTop: 0,
    },

    top: {
        marginTop: 15,
        alignItems: 'center',
    },

    loginButtons: {
        marginTop: 15,
        marginLeft: 40,
        marginRight: 40,
        justifyContent: 'flex-start',
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

    contentContainer: {
        paddingVertical: 10,
        paddingBottom: 60
    },

});

export default ProfileViewScreen




