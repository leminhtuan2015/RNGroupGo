import {NavigationActions} from "react-navigation";
import * as ActionTypes from "../../constants/ActionTypes";

class NavigationHelper {
    static resetTo = (component, route) => {
        const actionToDispatch = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({routeName: route,})],
        });

        component.props.navigation.dispatch(actionToDispatch);
    }

    static gotoMapWithFriend = (component, channelId, friendId) => {
        component.props.dispatch({
            type: ActionTypes.MAP_SET_FRIEND_IN_MAP,
            data: {friendId: friendId, channelId: channelId}
        })

        component.props.dispatch({
            type: ActionTypes.SAGA_GET_FRIEND_DATA_IN_MAP,
            friendId: friendId
        })

        NavigationHelper.resetTo(component, "RootStack")
    }

    static goToHome = (component) => {
        component.props.dispatch({
            type: ActionTypes.MAP_SET_FRIEND_IN_MAP,
            data: {friendId: null, channelId: null}
        })

        component.props.dispatch({
            type: ActionTypes.MAP_SET_FRIEND_DATA_IN_MAP,
            data: {friendData: null}
        })

        NavigationHelper.resetTo(component, "RootStack")
    }
}

export default NavigationHelper