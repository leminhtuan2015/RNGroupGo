import { StackNavigator } from 'react-navigation';

import StackDrawerNavigatorView from '../components/screens/StackDrawerNavigatorView';
import TabNavigatorView from '../components/screens/TabNavigatorView';

//const init = "RootTabs"
const init = "RootStackDrawer"

const RootNavigatorView = StackNavigator({
  RootTabs: {screen: TabNavigatorView},
  RootStackDrawer: {screen: StackDrawerNavigatorView},
}, {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: init
})


export default RootNavigatorView
