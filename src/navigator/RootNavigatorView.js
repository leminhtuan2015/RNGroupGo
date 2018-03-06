import {StackNavigator} from 'react-navigation';

import StackNavigatorView from '../components/screens/StackNavigatorView';

const init = "RootStack"

const RootNavigatorView = StackNavigator({
    RootStack: {screen: StackNavigatorView},
}, {
    // Default config for all screens
    headerMode: 'none',
    title: 'Main',
    initialRouteName: init
})


export default RootNavigatorView
