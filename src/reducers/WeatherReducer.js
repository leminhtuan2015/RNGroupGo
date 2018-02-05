import * as ActionTypes from "../constants/ActionTypes"
import Weather from "../models/Weather"


let weather = new Weather() 

export const WeatherReducer = (state = weather, action) => {
  const {type, data} = action 

  switch (type) {
  case ActionTypes.GET_WEATHER_DATA:
    return state
  case ActionTypes.SAVE_WEATHER_DATA:
    state = data
    return state
  default:
    return state 
  }
}

export default WeatherReducer




