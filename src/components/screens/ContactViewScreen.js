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

import * as ActionTypes from "../../constants/ActionTypes"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },

  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 60,
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
  static navigationOptions = {
    drawerLabel: 'Contacts',
    tabBarLabel: 'Contacts',
  };

  constructor(props){
    super(props)

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: this.ds.cloneWithRows([]),
    }
  }

  onPressListItem = (rowData) => {
    console.log("Pressed : " + JSON.stringify(rowData))
    const userId = rowData.key
    this.props.dispatch({type: ActionTypes.SET_USERS_IN_MAP,
      data: [userId]})
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
        subtitleStyle={{color: "#blue", fontSize: 16}}
        title={rowData.name}
        subtitle={rowData.id}
      />
    )
  }

  componentWillReceiveProps = (newProps) => {
    console.log("will receive props")
    
    if(newProps == this.props){return}

    //this.setState({
    //  dataSource: this.ds.cloneWithRows(newProps.store.contactState.filterUsers),
    //})
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


