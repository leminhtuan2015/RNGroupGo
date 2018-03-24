import React from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    ListView,
    StyleSheet,
    Linking,
    Platform,
} from "react-native"

import {
    List,
    ListItem,
} from 'react-native-elements'

import AppLink from 'react-native-app-link'
import DialogBox from "react-native-dialogbox"
import BaseViewScreen from "./BaseViewScreen";
import IconManager from "../../utils/IconManager";

class SettingViewScreen extends BaseViewScreen {

    static APPLE_APP_ID = "id1362024645"
    static GOOGLE_APP_ID = "com.leminhtuan.locationsharing"

    static APPLE_DEVELOPER_ID = "id1191347157"
    static GOOGLE_DEVELOPER_ID = "5054071932619131185"

    constructor(props) {
        super(props)

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.tableData = [
            {title: "Apps", value: " "},
            {title: "Vote", value: " "},
            {title: "Feedback", value: " "},
            {title: "Infomation", value: " "},
            {title: "Invite Friend", value: " "}
        ]

        this.tableDataIcon = [
            (IconManager.ionIcon(Platform.OS === 'ios' ? "ios-appstore" : "md-appstore", 33, "#009688")),
            (IconManager.ionIcon("md-thumbs-up", 33, "#FFD600")),
            (IconManager.ionIcon("md-send", 30, "#311B92")),
            (IconManager.ionIcon("ios-information-circle", 33, "#03A9F4")),
            (IconManager.ionIcon("ios-contacts", 33, "#FF6F00")),
        ]

        this.userInfoDataSource = this.ds.cloneWithRows(this.tableData)
        this.dialogbox = null
    }

    openInfomationDialog = () => {
        this.dialogbox.tip({
            title: "Infomation",
            content: "Version 1.0.0",
            btn: {
                text: "OK",
                callback: () => {
                },
            },
        });
    }

    openVoteApp = () => {
        const appStoreId = SettingViewScreen.APPLE_APP_ID
        const playStoreId = SettingViewScreen.GOOGLE_APP_ID

        AppLink.openInStore(appStoreId, playStoreId).then(() => {
            // do stuff
        }).catch((err) => {
            this.dialogbox.tip({
                title: "Notification",
                content: "Can not open app store.",
                btn: {
                    text: "OK",
                    callback: () => {
                    },
                },
            });
        });
    }

    openFeedback = () => {
        Linking.openURL('mailto:minhtuan.techno@gmail.com?subject=Feedback&body=LocalSharing')
    }

    openDevelopApps = () => {
        let linkApple = "itms-apps://itunes.apple.com/us/developer/apple/" + SettingViewScreen.APPLE_DEVELOPER_ID + "?mt=8"
        let linkGG = "market://play.google.com/store/apps/dev?id=" + SettingViewScreen.GOOGLE_DEVELOPER_ID
        let link = linkApple

        Platform.OS === 'ios' ? link = linkApple : link = linkGG

        Linking.canOpenURL(link).then(supported => {
            supported && Linking.openURL(link)
        }, (err) => {
            this.dialogbox.tip({
                title: "Notification",
                content: "Can not open app store.",
                btn: {
                    text: "OK",
                    callback: () => {
                    },
                },
            });
        })
    }

    inviteFriend = () => {
        this.props.navigation.navigate("InviteFriendView")
    }

    onPressListItem = (rowData) => {
        const title = rowData.title

        if (title == this.tableData[4]["title"]) {
            this.inviteFriend()
        } else if (title == this.tableData[3]["title"]) {
            this.openInfomationDialog()
        } else if (title == this.tableData[2]["title"]) {
            this.openFeedback()
        } else if (title == this.tableData[1]["title"]) {
            this.openVoteApp()
        } else if (title == this.tableData[0]["title"]) {
            this.openDevelopApps()
        }
    }

    renderRow = (rowData, sectionID, rowID, higlightRow) => {

        console.log(" renderRow : " + rowID)

        return (
            <ListItem
                onPress={() => {
                    this.onPressListItem(rowData)
                }}

                roundAvatar
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

    renderListView = () => {
        return (
            <ScrollView
                contentContainerStyle={styles.contentContainer}>
                <List
                    style={{flex: 1,}}
                    enableEmptySections={true}
                    containerStyle={{
                        borderBottomColor: "#ffffff",
                        borderBottomWidth: 0,
                        borderTopWidth: 0,
                    }}>

                    <ListView
                        automaticallyAdjustContentInsets={false}
                        enableEmptySections={true}
                        renderRow={this.renderRow}
                        dataSource={this.userInfoDataSource}/>
                </List>
            </ScrollView>
        )
    }

    render = () => {
        return (
            <View style={styles.container}>
                {this.renderListView()}

                <DialogBox ref={dialogbox => {
                    this.dialogbox = dialogbox
                }}/>
            </View>
        )
    }

    componentDidMount = () => {
        this.props.navigation.setParams({headerTitle: "More"})
    }
}

export default SettingViewScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        backgroundColor: "white",
    },

    contentContainer: {
        // paddingVertical: 0,
        // paddingBottom: 60
    },

});
