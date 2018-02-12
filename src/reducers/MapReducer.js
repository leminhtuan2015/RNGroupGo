import * as ActionTypes from "../constants/ActionTypes"
import * as Utils from "../utils/Utils"
import FirebaseHelper from "../helpers/FirebaseHelper"
import DeviceInfo from 'react-native-device-info';

export const MapReducer = (state = {}, action) => {

  const {type, data} = action 

  switch (type) {
  case ActionTypes.GET_CURRENT_PLACE:
    return getCurrentPlace(state)
  case ActionTypes.UPDATE_CURRENT_PLACE_TO_FIREBASE:
    updateLocationToFirebase(data) 
    return state
  default:
    return state 
  }
}

function getCurrentPlace(state){
  Utils.getCurrentPosition((region, error) => {
    console.log("Get Current Position done" + JSON.stringify(region))
    console.log("Get Current Position error" + JSON.stringify(error))

    return Object.assign({}, state, {currentCoordinate: region})
  }) 

    return state 
}

function updateLocationToFirebase(data){
	const uniqueId = DeviceInfo.getUniqueID();

  FirebaseHelper.write("users/" + uniqueId +"/coordinate", data)
} 

export default MapReducer


