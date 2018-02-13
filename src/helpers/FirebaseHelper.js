var firebase = require("firebase");

var config = {
	apiKey: "AIzaSyBr_UcbJtRJhIltfk4bBKRTeAXkTW7jAvg",
	authDomain: "react-native-way.firebaseapp.com",
	databaseURL: "https://react-native-way.firebaseio.com",
	projectId: "react-native-way",
	storageBucket: "react-native-way.appspot.com",
	messagingSenderId: "289883308274"
}

firebase.initializeApp(config)

let database = firebase.database()

class FirebaseHelper {

  static subscribe(path, callback){
    let ref = database.ref(path);
    ref.on('value', function(snapshot) {
      callback(snapshot.val())
    });
  }
  
  static read(path){
    return database
      .ref(path)
      .once('value')
      .then(function(snapshot) {
        return snapshot.val()
    })
  }

  static write(path, dataObject){
		database.ref(path).set(dataObject); 
  }
  
  static filter(keyword, path, orderBy = "name"){
    console.log("FILTERING : kw = " + keyword + " path = " + path + " or = " + orderBy)
    let query = database
      .ref(path)
      .orderByChild(orderBy)
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




