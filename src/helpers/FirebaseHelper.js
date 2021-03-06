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

    static onDisconnect(path, value) {
        var ref = firebase.database().ref(path)
        ref.onDisconnect().set(value)
    }

    static subscribe(path, callback) {
        FirebaseHelper.unSubscribe(path)

        let ref = database.ref(path);
        var willCallBack = false
        ref.on('value', function (snapshot) {
            if (willCallBack) {
                callback(snapshot.val())
            }
            willCallBack = true
        });
    }

    static unSubscribe(path) {
        //ref.off("value", originalCallback);
        //ref.off("value", originalCallback, this);
        //ref.off("value");

        let ref = database.ref(path);
        ref.off();
    }

    static observe(path, callback) {
        let ref = database.ref(path);
        ref.on('value', function (snapshot) {
            callback(snapshot.val())
        });
    }


    static read(path) {
        return database
            .ref(path)
            .once('value')
            .then(function (snapshot) {
                return snapshot.val()
            })
    }

    static write(path, dataObject) {
        database.ref(path).set(dataObject);
    }

    static push(path, dataObject) {
        database.ref(path).push(dataObject);
    }

    static filter(keyword, path, orderBy = "name") {
        console.log("FILTERING : kw = " + keyword + " path = " + path + " or = " + orderBy)
        let query = database
            .ref(path)
            .orderByChild(orderBy)
            .limitToFirst(30)
            .startAt(keyword)
            .endAt(keyword + "\uf8ff")
            .once("value", function (data) {
                // return data
            })

        return query
    }

    static snapshotToArray(snapshot) {
        let returnArr = []

        if (!snapshot) {
            return returnArr
        }

        snapshot.forEach(function (childSnapshot) {
            const item = childSnapshot.val()
            item.key = childSnapshot.key

            returnArr.push(item)
        })

        return returnArr
    }

    static objectToArray(object) {
        let returnArr = []

        if (!object) {
            return returnArr
        }

        for (var key in object) {
            const item = object[key]
            item.key = key

            returnArr.push(item)
        }

        return returnArr
    }
}

export default FirebaseHelper




