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

import { NavigationActions } from 'react-navigation';
import * as ActionTypes from "../../constants/ActionTypes"
import * as Utils from "../../utils/Utils"
import NavBarItem from "../views/NavBarItem"

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
    const { params = {} } = navigation.state;

    const headerLeft = 
      <NavBarItem 
        iconName="times"
        color="gray"
        onPress={ () => {navigation.goBack()}} />
 
    return {
      drawerLabel: 'Contacts',
      tabBarLabel: 'Contacts',
			headerLeft: headerLeft,
		}
  };

  constructor(props){
    super(props)

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.selectedUser = null

    this.state = {
      dataSource: this.ds.cloneWithRows([]),
    }
  }

  resetTo = (route) => {
    const actionToDispatch = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({routeName: route, params: {selectedUser: this.selectedUser}})],
    });
    this.props.navigation.dispatch(actionToDispatch);
}

  subscribe = (path) => {
    console.log("Subscribe ContactView: " + path)

    callback = (data) => {
      console.log("callback data : " + JSON.stringify(data))

      const friendResponseStatus = data.users[this.selectedUser.key]

      if(friendResponseStatus == 1){
        Alert.alert("Accepted")
        this.gotoMapWithFriend(this.selectedUser.key)
      } else if(friendResponseStatus == -1){
        Alert.alert("Rejected")
        this.unSubscribeChannel(data)
      }

    }

    this.props.dispatch({type: ActionTypes.SUBSCRIBE,
      data: {path: path, callback: callback}})
  }

  createChannel = (userId) => {
    const channelId = Utils.guid()

    let jsonData = {}
    jsonData[userId] = 0
    jsonData[Utils.uniqueId()] = 1

    this.props.dispatch({type: ActionTypes.CREATE_CHANNEL,
                     data: {jsonData: jsonData, channelId: channelId}})

    return channelId
  }

  requestLocation = (userId) => {

    const channelId = this.createChannel(userId)
    this.subscribe("channels/" + channelId)

    this.props.dispatch({type: ActionTypes.REQUEST_LOCATION,
      data: {fromUserId: Utils.uniqueId(),toUserId: userId, channelId: channelId}})
  }

  gotoMapWithFriend = (userId) => {
    this.props.dispatch({type: ActionTypes.SET_USERS_IN_MAP, data: [userId]})
    this.resetTo("RootStack")
  }

  unSubscribeChannel = (data) => {
    console.log("leaveChannel : " + JSON.stringify(data))
    this.props.dispatch({type: ActionTypes.LEAVE_CHANNEL, data: data})
  }

  onPressListItem = (rowData) => {
    //this.props.navigation.goBack()
    //this.props.navigation.navigate("MapView")
    this.selectedUser = rowData
    const userId = rowData.key

    this.requestLocation(userId)
  }

  onTextChange = (text) => {
    console.log("dispatch filter user..........")
    this.props.dispatch({type: ActionTypes.FIREBASE_FILTER_USER, data: text})
  }

  renderRow = (rowData, sectionID) => {
    return (
      <ListItem
        onPress={() => {this.onPressListItem(rowData)}}
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
      <View id="container" style={styles.container}>
        <View id="contentContainer" style={styles.contentContainer}>
          <FormInput
            inputStyle={{color: "#2196f3", marginLeft: 20}}
            containerStyle={{backgroundColor: "#fafafa", borderRadius: 25}}
            ref={(input) => {this.input = input}}
            onChangeText={(text) => {this.onTextChange(text)}}
            placeholder="Name"
            autoCorrect={false}
            defaultValue="" />

            <Text />

            <View style={{flex: 1}}>
              <List 
                style={{flex: 1, }}
                enableEmptySections={true}
                containerStyle={{
                  borderBottomColor: "#ffffff",
                  borderBottomWidth: 0,
                  borderTopWidth: 1,}}>
                <ListView 
                  enableEmptySections={true}
                  renderRow={this.renderRow}
                  dataSource={this.state.dataSource}/>
              </List>
            </View>
        </View>
      </View>
    );
  }
}

export default ContactViewScreen


