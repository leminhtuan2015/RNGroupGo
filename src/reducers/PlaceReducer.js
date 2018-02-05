import * as ActionTypes from "../constants/ActionTypes"
import Place from "../models/Place"

import cities from '../resources/jsons/city.list.json';

let place = new Place()
let places = []

export const PlaceReducer = (state = {
  place: place, 
  places: places, 
  cities: cities, 
  isLoading: true}, action) => {

  const {type, data} = action 

  switch (type) {
  case ActionTypes.TEST_CHANGE_PROPS:
    return testChangeProps(state, "")
  case ActionTypes.SAVE_PLACES:
    return savePlaces(state, data)   
  case ActionTypes.SET_PLACE_LOADING:
    return setPlaceLoading(state)  
  case ActionTypes.ADD_PLACE:
    return addPlace(state, data)  
  case ActionTypes.FILTER_CITY:
    return filterCity(state, data)
  case ActionTypes.SET_FILTER_CITIES:
    return setFilterCities(state, data)
  case ActionTypes.DELETE_PLACE:
    return deletePlace(state, data)
  default:
    return state 
  }
}

function testChangeProps(state, data){
  console.log("place reducer - test change props: " + data)
  //return state // not change props
  return Object.assign({}, state, {newState: true}) // change props
}

function deletePlace(state, data){
  console.log("place reducer - delete place: " + data)

  let places = state.places

  for(i = 0; i < places.length; i++){
    let place = places[i]
    
    if(place.id == data){
      let index = places.indexOf(place)  
      console.log("delete at index : " + index)
      places.splice(index, 1);
    }
  }
  
  Place.save(JSON.stringify(places))
  let newState = Object.assign({}, state, {places: places})
  return newState
}

function setPlaceLoading(state){
  let newState = Object.assign({}, state, {isLoading: true})
  return newState
}

function savePlaces(state, data){
  //state.places = data  // NOT WORK
  console.log("place reducer - save place: " + data)
  let newState = Object.assign({}, state, {places: data, isLoading: false})
  return newState
}

function addPlace(state, data){
  console.log("place reducer - add place: " + data)
  let city = data.city
  let countryCode = data.countryCode
  let newPlace = new Place("", city, countryCode, "--")
  state.places.push(newPlace)
  Place.save(JSON.stringify(state.places))

  let newState = Object.assign({}, state)
  return newState 
}

function filterCity(state, keyword){
	console.log("place reducer - filter place: " + keyword)
	let citiesFilter = filter(keyword)
  let newState = Object.assign({}, state, {cities: citiesFilter})
  
  return newState
}

function setFilterCities(state, data){
  let newState = Object.assign({}, state, {cities: data})

  return newState
}

function filter(keyword){
  var data = []    

  if(keyword){
    var dataFilter = cities.filter(function (city) {
      return city.name.toLowerCase() == keyword.toLowerCase() 
        || city.name.toLowerCase().includes(keyword.toLowerCase());
    })

    data = dataFilter
  } else {
    data = cities    
  }

  return data
}



export default PlaceReducer




