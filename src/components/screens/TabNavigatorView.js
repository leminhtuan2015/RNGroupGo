import React from 'react';
import { Text, View, Button } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';

import HomeViewContainer from '../../containers/HomeViewContainer';
import PlaceViewContainer from '../../containers/PlaceViewContainer';
import AddPlaceViewContainer from '../../containers/AddPlaceViewContainer';

class TabDetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Details!</Text>
      </View>
    );
  }
}

class TabSettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        { /* other code from before here */ }
        <Button
          title="SETTING : Go to Details"
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
    TabStackWeather: { screen: TabStackWeather },
    TabStackUser: { screen: TabStackUser },
    TabDetailsScreen: { screen: TabDetailsScreen },
    TabSettingsScreen: { screen: TabSettingsScreen },
  },
  {
  }
);

export default TabNavigatorView
