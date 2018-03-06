import FacebookLoginHelper from "./FacebookLoginHelper";

var firebase = require("firebase");

class FirebaseAuthHelper {

    static facebookLogin = () => {
        let facebookLoginCallback = (accessToken) => {
            FirebaseAuthHelper.facebookAuth(accessToken, (userId) => {
                alert("User ID : " + userId)
            })
        }

        FacebookLoginHelper.login(facebookLoginCallback)
    }

    static facebookAuth = (accessToken, callback) => {
        var credential = firebase.auth.FacebookAuthProvider.credential(accessToken);

        firebase.auth().signInWithCredential(credential)
            .then((user) => {
                console.log("User id : " +user.uid )
                callback(user.uid)
            }).catch((err) => {
            console.error('User signin error', err);
            callback(null)
        });
    }

    static logout = () => {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            FacebookLoginHelper.logOut()
        }, function(error) {
            // An error happened.
        });
    }

    static currentUser = () => {
        const user = firebase.auth().currentUser

        return user
    }

    static isLoggedIn = () => {
        if(FirebaseAuthHelper.currentUser()){
            return true
        }

        return false
    }
}

export default FirebaseAuthHelper