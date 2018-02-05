import {AsyncStorage} from "react-native"
import * as Utils from "../utils/Utils"

class Place {
  static ALL_PLACE = "ALL_PLACE"

  constructor(id, city, countryCode, temp){
    this.id = id || Utils.guid()
    this.city = city || "--"
    this.countryCode = countryCode || "--"
    this.temp = temp || "--"
  }

  static async save(placesJson) {
    try {
      console.log("Create: " )
      //await AsyncStorage.setItem("ALL_PLACE", placesJson) 
      AsyncStorage.setItem("ALL_PLACE", placesJson) 
      console.log("Create: Done" )
    } catch (error) {
      console.log("Create places error: " + error) 
    }  
  }

  static all = () => {
    
    let place1 = new Place(Utils.guid(), "Hanoi", "vn", "--")
    let place2 = new Place(Utils.guid(), "Danang", "vn", "--")
    let place3 = new Place(Utils.guid(), "London", "uk", "--")
    let place4 = new Place(Utils.guid(), "New York", "us", "--")
    let place5 = new Place(Utils.guid(), "Tokyo", "jp", "--")

    let places = [place1, place2, place3, place4, place5] 
    
    return places
  }

 static async allFromStorage() {
    try {
      let placesJson = await AsyncStorage.getItem("ALL_PLACE")
      
      if(placesJson){
        console.log("From storage: " + placesJson)
        return JSON.parse(placesJson) || []  
      } else {
        console.log("Init and save to store")
        let places = Place.all()
        Place.save(JSON.stringify(places))
        return places
      }
    } catch (error) {
      console.log("Error: " + error)
      return []
    }
  }

  static todayWeather = () => {
    return Place.all() 
  }
}

export default Place





