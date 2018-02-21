import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Button,
  Image,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ListView,
} from "react-native"

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

class GroupViewScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Groups',
    tabBarLabel: 'Groups',
    headerTitle: 'Groups',
  };

  constructor(props){
    super(props)
  
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: this.ds.cloneWithRows([{name: "1"}]),
    }

    this.getData()
  }

  getData = () => {
    this.props.dispatch({type: ActionTypes.GET_GROUPS, data: {userId: Utils.uniqueId()}}) 
  }

  componentWillReceiveProps = (newProps) => {
    console.log("Group will receive props :" + JSON.stringify(this.props))
    
    this.setState({
      dataSource: this.ds.cloneWithRows(newProps.store.groupState.groups),
    })
  }

  onPressListItem = (rowData) => {
    console.log("Pressed : " + JSON.stringify(rowData))
  }

  renderRow = (rowData, sectionID) => {
    return (
      <ListItem
        onPress={() => {this.onPressListItem(rowData)}}
        underlayColor="#bdbdbd"
        titleStyle={{color: "green", fontSize: 24}}
        subtitleStyle={{color: "blue", fontSize: 16}}
        title={rowData.name}
      />
    )
  }

  render() {
    return (
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
    );
  }
}

export default GroupViewScreen




