import React from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ScrollView,
    ImageBackground,
    ActivityIndicator,
    ListView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';

import {
    Icon,
    Divider,
    FormLabel,
    FormInput,
    FormValidationMessage,
    List,
    ListItem,
} from 'react-native-elements'

import {NavigationActions} from 'react-navigation';
import * as ActionTypes from "../../constants/ActionTypes"
import * as Utils from "../../utils/Utils"
import NavBarItem from "../views/NavBarItem"
import Indicator from "../views/Indicator"
import MessageService from "../../services/MessageService"

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
            dataSource: this.ds.cloneWithRows([]),
            isShowingIndicator: false,
        }

        this.messageService = new MessageService(this)
    }

    onPressListItem = (rowData) => {
        //this.props.navigation.goBack()
        //this.props.navigation.navigate("MapView")
        const userId = rowData.key
        this.setState({isShowingIndicator: true})
        this.messageService.requestFriendLocation(userId)
    }

    onTextChange = (text) => {
        console.log("dispatch filter user..........")
        this.props.dispatch({type: ActionTypes.FIREBASE_FILTER_USER, data: text})
    }

    renderRow = (rowData, sectionID) => {
        return (
            <ListItem
                onPress={() => {
                    this.onPressListItem(rowData)
                }}
                underlayColor="#bdbdbd"
                titleStyle={{color: "green", fontSize: 24}}
                subtitleStyle={{color: "blue", fontSize: 16}}
                title={rowData.name}
                subtitle={rowData.id}
            />
        )
    }

    componentWillReceiveProps = (newProps) => {
        console.log("Contact will receive props :" + JSON.stringify(this.props))

        this.setState({
            dataSource: this.ds.cloneWithRows(newProps.store.userState.filterUsers),
        })
    }

    render() {
        return (
            <TouchableWithoutFeedback id="container" style={styles.container} onPress={() => Keyboard.dismiss()}>
                <View id="contentContainer" style={styles.contentContainer}>
                    {this.state.isShowingIndicator && <Indicator/>}
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
                                dataSource={this.state.dataSource}/>
                        </List>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default ContactViewScreen


