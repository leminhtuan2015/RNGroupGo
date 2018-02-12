import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from "redux-thunk"
import createSagaMiddleware from 'redux-saga'

import WeatherReducer from '../reducers/WeatherReducer'
import PlaceReducer from '../reducers/PlaceReducer'
import MapReducer from '../reducers/MapReducer'
import RootNavigatorReducer from '../navigator/RootNavigatorReducer'

import rootSaga from '../saga/Saga'

const reducers = combineReducers({
  weatherState: WeatherReducer,  // WeatherReducer is manage weatherState data object
  placeState: PlaceReducer,  
  mapState: MapReducer,  
  nav: RootNavigatorReducer,
});

const sagaMiddleware = createSagaMiddleware()

let Store = createStore(reducers, applyMiddleware(sagaMiddleware))

console.log("Store state: " + JSON.stringify(Store.getState()))

sagaMiddleware.run(rootSaga)

export default Store;




