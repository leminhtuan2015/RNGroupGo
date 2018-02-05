var firebase = require("firebase");

var config = {
  apiKey: "AIzaSyBjrTO1f1u17LNYwW054-3EVoNqL5wA0O0",
  authDomain: "react-native-weather-87fee.firebaseapp.com",
  databaseURL: "https://react-native-weather-87fee.firebaseio.com",
  projectId: "react-native-weather-87fee",
  storageBucket: "react-native-weather-87fee.appspot.com",
  messagingSenderId: "663997325870" 
}

firebase.initializeApp(config)

let database = firebase.database()

class FirebaseHelper {
  
  static read(){
    return database
      .ref('/cities/99099/')
      .once('value')
      .then(function(snapshot) {

        var username = (snapshot.val()) || 'Anonymous';
        
        return username
    })
  }
  
  static filter(keyword){
    let query = database
      .ref("cities")
      .orderByChild("name")
      .limitToFirst(30)
      .startAt(keyword)
      .endAt(keyword + "\uf8ff")
      .once("value", function(data) {
         //console.log("Equal to filter: " + JSON.stringify(data.val()));
         
         let arrayData = FirebaseHelper.snapshotToArray(data) 

         //console.log("Array filter: " + JSON.stringify(arrayData));
         return arrayData
    })
		
		return query
  }

	static snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
	};


}

export default FirebaseHelper




