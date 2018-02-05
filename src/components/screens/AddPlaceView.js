import React, { Component } from 'react';
import { Button, List, ListItem, } from 'react-native-elements'

import {
  Divider,
  FormLabel, 
  FormInput, 
  FormValidationMessage,
  Icon,
} from 'react-native-elements'

import {
  RkButton,
  RkTextInput,  
} from 'react-native-ui-kitten';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ImageBackground,
  ListView,
} from 'react-native';

import * as ActionTypes from "../../constants/ActionTypes"
import {styleStackHeader} from "../../utils/Constant.js"

class EditView extends Component<{}> {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
		
		this.headerRight = 
      <Icon 
        name="save"
        size={30}
        underlayColor="transparent"
        color='#ffffff'
        onPress={params.rightButtonOnPress ? params.rightButtonOnPress : () => null} />
    
    return {
      tabBarLabel: 'Home',
      headerTitle: '',
      title: 'Add Place',
      headerTintColor: 'white',
		  headerStyle: styleStackHeader,
			headerRight: this.headerRight
		}
	}

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: this.ds.cloneWithRows(this.props.store.placeState.cities),
      place: {city: "", countryCode: ""},
      isSaveButtonPressed: false,
    }

   // console.log("state at constructor: " + JSON.stringify(this.state))

    this.bind()
  }

  bind = () => {
    this.props.navigation
      .setParams({rightButtonOnPress: this.saveButtonPress}); 
  }

  saveButtonPress = () => {
    this.inputCity.shake()
    this.setState({isSaveButtonPressed: true})
   // console.log("Current state: " + JSON.stringify(this.state))

   this.props.dispatch({type: ActionTypes.TEST_CHANGE_PROPS})
    
    if(this.state.place.city){
      this.props.dispatch({type: ActionTypes.ADD_PLACE, 
        data: {
          city: this.state.place.city, 
          countryCode: this.state.place.countryCode
        }
      })

      this.props.navigation.goBack()
    }
  }

  homeButtonPress = () => {
    this.props.navigation.goBack()
  }

  onPressListItem = (rowData) => {
    console.log("Pressed : " + JSON.stringify(rowData))
    this.setState({
      place: {city: rowData.name, countryCode: rowData.country},
      isSaveButtonPressed: false,
    }) 
  }

  onCityTextChange = (text) => {
    this.setState({place : {city: text}})
    console.log("before dispatch..........")
    //this.props.dispatch({type: ActionTypes.FILTER_CITY, data: text})
    this.props.dispatch({type: ActionTypes.FIREBASE_FILTER_CITY, data: text})
  }

  componentWillReceiveProps = (newProps) => {
    console.log("will receive props")

    this.setState({
      dataSource: this.ds.cloneWithRows(newProps.store.placeState.cities),
      isSaveButtonPressed: false,
    })
  }

  renderRow = (rowData, sectionID) => {
    return (
      <ListItem
        onPress={() => {this.onPressListItem(rowData)}}
        underlayColor="#bdbdbd"
        titleStyle={{color: "#ffffff", fontSize: 24}}
        subtitleStyle={{color: "#eeeeee", fontSize: 16}}
        key={sectionID}
        title={rowData.name}
        subtitle={rowData.country}
      />
    )
  }

  textInputError = () => {
    if(!this.state.place.city && this.state.isSaveButtonPressed){
      return (
        <FormValidationMessage containerStyle={{marginLeft: 5}}>
          {'This field is required'}
        </FormValidationMessage> 
      )
    } 
  }
 
  view = () => (
    <View id="container" style={styles.container}>
      <ImageBackground 
        source={require('../../resources/images/background_1.jpg')} 
        style={styles.backgroundImage} >

        <View id="contentContainer" style={styles.contentContainer}>
            <FormInput
              key="city"
              value={this.state.place.city}
              inputStyle={{color: "#2196f3", marginLeft: 20}}
              containerStyle={{backgroundColor: "#fafafa", borderRadius: 25}}
              ref={(inputCity) => {this.inputCity = inputCity}}
              onChangeText={(text) => {this.onCityTextChange(text)}}
              placeholder="City"
							autoCorrect={false}
              defaultValue="" />

            {this.textInputError()}

            <Text />

            <View style={{flex: 1}}>
              <List 
                style={{flex: 1, }}
                containerStyle={{
                  backgroundColor: "transparent", 
                  borderBottomColor: "#ffffff",
                  borderBottomWidth: 0,
                  borderTopWidth: 1,}}>
                <ListView 
                  renderRow={this.renderRow}
                  dataSource={this.state.dataSource}
                />
              </List>
            </View>

        </View>
       </ImageBackground>
    </View>
   )

  render() {
    return this.view()
  }
}

 var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },

  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 80,
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

export default EditView

