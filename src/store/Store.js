import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from "redux-thunk"
import createSagaMiddleware from 'redux-saga'

import RootNavigatorReducer from '../navigator/RootNavigatorReducer'
import MapReducer from '../reducers/MapReducer'
import UserReducer from '../reducers/UserReducer'

import rootSaga from '../saga/Saga'

const reducers = combineReducers({
    nav: RootNavigatorReducer,
    mapState: MapReducer,
    userState: UserReducer,
});

const sagaMiddleware = createSagaMiddleware()

let Store = createStore(reducers, applyMiddleware(sagaMiddleware))

console.log("Store state: " + JSON.stringify(Store.getState()))

sagaMiddleware.run(rootSaga)

export default Store;




