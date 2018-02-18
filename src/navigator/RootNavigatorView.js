import { StackNavigator } from 'react-navigation';

import StackDrawerNavigatorView from '../components/screens/StackDrawerNavigatorView';
import StackNavigatorView from '../components/screens/StackNavigatorView';
import TabNavigatorView from '../components/screens/TabNavigatorView';

const init = "RootStack"
//const init = "RootTabs"
//const init = "RootStackDrawer"

const RootNavigatorView = StackNavigator({
  RootStack: {screen: StackNavigatorView},
  RootTabs: {screen: TabNavigatorView},
  RootStackDrawer: {screen: StackDrawerNavigatorView},
}, {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: init
})


export default RootNavigatorView
