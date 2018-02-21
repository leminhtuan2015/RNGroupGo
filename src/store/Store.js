import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from "redux-thunk"
import createSagaMiddleware from 'redux-saga'

import RootNavigatorReducer from '../navigator/RootNavigatorReducer'
import WeatherReducer from '../reducers/WeatherReducer'
import PlaceReducer from '../reducers/PlaceReducer'
import MapReducer from '../reducers/MapReducer'
import UserReducer from '../reducers/UserReducer'
import GroupReducer from '../reducers/GroupReducer'

import rootSaga from '../saga/Saga'

const reducers = combineReducers({
  nav: RootNavigatorReducer,
  weatherState: WeatherReducer,  // WeatherReducer is manage weatherState data object
  placeState: PlaceReducer,  
  mapState: MapReducer,  
  userState: UserReducer,  
  groupState: GroupReducer,  
});

const sagaMiddleware = createSagaMiddleware()

let Store = createStore(reducers, applyMiddleware(sagaMiddleware))

console.log("Store state: " + JSON.stringify(Store.getState()))

sagaMiddleware.run(rootSaga)

export default Store;




