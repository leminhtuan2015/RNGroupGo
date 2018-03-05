import {NavigationActions} from 'react-navigation';
import RootNavigatorView from './RootNavigatorView';

const initialState = RootNavigatorView.router.getStateForAction(NavigationActions.init());

export default (state = initialState, actions) => {
    const nextState = RootNavigatorView.router.getStateForAction(actions, state);

    return nextState || state;
}
