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

class ContactViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            userDataSource: this.ds.cloneWithRows([]),
        }
    }

    onPressListItem = (rowData) => {
        const friendUserId = rowData.key
        this.requestShareLocation(friendUserId)
    }

    onTextChange = (text) => {
        console.log("dispatch filter user..........")
        this.props.dispatch({type: ActionTypes.SAGA_FIREBASE_FILTER_USER, data: text})
    }

    requestShareLocation = (friendUserId) => {
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

                titleStyle={{color: "#263238", fontSize: 16}}
                rightTitleStyle={{color: "gray", fontSize: 14}}
                subtitleStyle={{color: "gray", fontSize: 12}}

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
            <FormInput
                inputStyle={{color: "#2196f3", marginLeft: 10}}
                // containerStyle={{backgroundColor: "#fafafa", borderRadius: 25}}
                ref={(input) => {
                    this.input = input
                }}
                onChangeText={(text) => {
                    this.onTextChange(text)
                }}
                placeholder="Search"
                autoFocus={true}
                autoCorrect={false}
                defaultValue=""/>
        )
    }

    renderIndicator = () => {
        return(
            <ActivityIndicatorCustom />
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

