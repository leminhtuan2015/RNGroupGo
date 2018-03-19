import React from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    ListView,
    StyleSheet,
} from "react-native"

import {
    List,
    ListItem,
} from 'react-native-elements'

import BaseViewScreen from "./BaseViewScreen";
import IconManager from "../../utils/IconManager";

class SettingViewScreen extends BaseViewScreen {

    constructor(props){
        super(props)

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.tableData = [
            {title: "Apps", value: " "},
            {title: "Vote", value: " "},
            {title: "Feedback", value: " "},
            {title: "Infomation", value: " "}
        ]

        this.tableDataIcon = [
            (IconManager.ionIcon("ios-apps", 30, "#009688")),
            (IconManager.ionIcon("md-thumbs-up", 30, "#FFD600")),
            (IconManager.ionIcon("ios-mail", 30, "#311B92")),
            (IconManager.ionIcon("ios-information-circle", 30, "#F44336")),
        ]

        this.userInfoDataSource = this.ds.cloneWithRows(this.tableData)
    }

    onPressListItem = (rowData) => {
        const title = rowData.title
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
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
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
                                dataSource={this.userInfoDataSource} />
                        </List>
                    </View>
                </ScrollView>
            </View>
        )
    }

    render = () => {
        return (
            <View style={styles.container}>
                {this.renderListView()}
            </View>
        )
    }
}

export default SettingViewScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 0,
        backgroundColor: "white",
    },

    contentContainer: {
        paddingVertical: 10,
        paddingBottom: 60
    },

});
