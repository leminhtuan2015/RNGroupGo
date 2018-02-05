import { DrawerNavigator, StackNavigator } from 'react-navigation';
import React from 'react';
import {
  StyleSheet,
  Button,
  Image,
  Text,
  View,
} from "react-native"

import { 
  Icon,
} from 'react-native-elements'

import NavBarItem from '../views/NavBarItem';

class DrawerHomeScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Drawer Home Screen',
  };

  render() {
    return (
      <View>
      <Button
        onPress={() => this.props.navigation.navigate('DrawerDetailScreen')}
        title="Go to Detail"
      />
      <Button
        onPress={() => this.props.navigation.navigate('HomeView')}
        title="Go to Weather"
      />

      </View>
    );
  }
}

class DrawerDetailScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Drawer Detail Screen',
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back"
      />
    );
  }
}

class DrawerSettingScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Drawer Setting Screen',
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back"
      />
    );
  }
}

const drawerOnPress = (navigation) => {
  console.log("Drawer Button Pressed: " + JSON.stringify(navigation.state))

  if (navigation.state.index === 0) {
    navigation.navigate('DrawerOpen')
  } else {
    navigation.navigate('DrawerClose')
  }
}

const drawerIcon1 = navigation => (
  <NavBarItem
    iconName="bars"
    onPress={() => {
      if (navigation.state.index === 0) {
        // check if drawer is not open, then only open it
        navigation.navigate('DrawerOpen');
      } else {
        // else close the drawer
        navigation.navigate('DrawerClose');
      }
    }}
  />
);

const drawerIcon = (navigation) => (<Icon 
  name="menu"
  marginLeft={30}
  size={30}
  color='#ffffff'
  underlayColor="transparent"
  onPress={() => drawerOnPress(navigation)} 
  />)

const DrawerNavigatorView = DrawerNavigator({
  DrawerHomeScreen: {screen: DrawerHomeScreen},
  DrawerDetailScreen: {screen: DrawerDetailScreen},
  DrawerSettingScreen: {screen: DrawerSettingScreen},
},
{
  drawerWidth: 200,
  drawerPosition: "left",
  initialRouteName: "DrawerHomeScreen",
  navigationOptions: ({navigation}) => ({
    headerStyle: {backgroundColor: 'green'},
    title: 'DrawerStackView',
    headerLeft: drawerIcon1(navigation), 
  })
});

const DrawerStackView = StackNavigator({
  drawer: { screen: DrawerNavigatorView }
}, {
  headerMode: 'none',
  navigationOptions: ({navigation}) => ({
    headerStyle: {backgroundColor: 'green'},
    title: 'DrawerStackView',
    gesturesEnabled: false,
    headerLeft: drawerIcon1(navigation), 
  })
})

export default DrawerStackView
//export default DrawerNavigatorView

