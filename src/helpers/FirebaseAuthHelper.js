import FacebookLoginHelper from "./FacebookLoginHelper";
import StatusTypes from "../constants/StatusTypes";

var firebase = require("firebase");

class FirebaseAuthHelper {

    static facebookAuth = (accessToken) => {
        var credential = firebase.auth.FacebookAuthProvider.credential(accessToken);

        return firebase.auth().signInWithCredential(credential)
            .then((user) => {
                console.log("User id : " +user.uid )

                return user

            }).catch((err) => {
            console.error('User signin error', err);

            return null
        });
    }

    static updateUserInfo = (user, userInfo) => {
        return user.updateProfile({
            displayName: userInfo.userName,
            photoURL: userInfo.imageUrl
        }).then(function() {
            // Update successful.
            return user
        }).catch(function(error) {
            // An error happened.
            return null
        });
    }

    static logout = () => {
        return firebase.auth().signOut().then(function() {
            // Sign-out successful.
            FacebookLoginHelper.logOut()
            return StatusTypes.SUCCESS
        }, function(error) {
            // An error happened.
            return StatusTypes.FAILED
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