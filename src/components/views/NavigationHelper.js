import {NavigationActions} from "react-navigation";

class NavigationHelper {
    static resetTo = (component, route) => {
        const actionToDispatch = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({routeName: route,})],
        });

        component.props.navigation.dispatch(actionToDispatch);
    }
}

export default NavigationHelper