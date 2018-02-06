import React from 'react';
import { Text, View, Button } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';

import { List,
  Icon,
} from 'react-native-elements'

import IconManager from "../../utils/IconManager"
import HomeViewContainer from '../../containers/HomeViewContainer';
import PlaceViewContainer from '../../containers/PlaceViewContainer';
import AddPlaceViewContainer from '../../containers/AddPlaceViewContainer';

class TabDetailsScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
      tabBarIcon: IconManager.icon("star", "red", () => {
        navigation.navigate("TabDetailsScreen")
      })
    }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Details!</Text>
      </View>
    );
  }
}

class TabSettingsScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
      tabBarIcon: IconManager.icon("bars", "green", () => {
        navigation.navigate("TabSettingsScreen")
      })
    }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        { /* other code from before here */ }
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('TabDetailsScreen')}
        />
      </View>
    );
  }
}
class TabStackUserScreen extends React.Component {

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          title="Go to User Detail"
          onPress={() => this.props.navigation.navigate('TabStackUserDetailScreen')}
        />

      </View>
    );
  }
}

class TabStackUserDetailScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        { /* other code from before here */ }
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}

const TabStackUser = StackNavigator({
  TabStackUserScreen: { screen: TabStackUserScreen},
  TabStackUserDetailScreen: { screen:  TabStackUserDetailScreen},
},
{
  tabBarIcon: IconManager.icon("user", "blue", () => {
    navigation.navigate("TabStackUserScreen")
  })
});

const TabStackWeather = StackNavigator({
  TabStackHomeScreen: { screen: HomeViewContainer},
  TabStackPlaceScreen: { screen:  PlaceViewContainer},
  TabStackAddPlaceScreen: { screen:  AddPlaceViewContainer},
},
{
});

const TabNavigatorView =  TabNavigator(
  {
    TabStackWeather: {
      screen: TabStackWeather, 
      navigationOptions: ({navigation}) => ({
				showLabel: false,
				tabBarIcon: IconManager.icon("apple", "black", () => {
					navigation.navigate("TabStackWeather")
				}),
				showIcon: true
		  }) 
    },

    TabStackUser: { 
      screen: TabStackUser, 
			navigationOptions: ({navigation}) => ({
				tabBarLabel: "User",
				tabBarIcon: IconManager.icon("user", "blue", () => {
					navigation.navigate("TabStackUser")
				}),
				showIcon: true
		  })  
    },

    TabDetailsScreen: {
      screen: TabDetailsScreen, 
      navigationOptions: ({navigation}) => ({
				tabBarLabel: "Detail",
		  }) 
    },
    TabSettingsScreen: {
      screen: TabSettingsScreen,
      navigationOptions: ({navigation}) => ({
				tabBarLabel: "Detail",
		  }) 
    },
  },
  {
  }
);

export default TabNavigatorView
