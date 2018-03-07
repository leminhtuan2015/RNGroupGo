import FacebookLoginHelper from "./FacebookLoginHelper";

var firebase = require("firebase");

class FirebaseAuthHelper {

    static facebookLogin = () => {
        let facebookLoginCallback = (accessToken) => {
            FirebaseAuthHelper.facebookAuth(accessToken, (userId) => {
                console.log("User ID : " + userId)
            })
        }

        FacebookLoginHelper.login(facebookLoginCallback)
    }

    static facebookAuth = (accessToken, callback) => {
        var credential = firebase.auth.FacebookAuthProvider.credential(accessToken);

        firebase.auth().signInWithCredential(credential)
            .then((user) => {
                console.log("User id : " +user.uid )

                FirebaseAuthHelper.facebookUpdateUserInfo(user)

                callback(user.uid)

            }).catch((err) => {
            console.error('User signin error', err);
            callback(null)
        });
    }

    static facebookUpdateUserInfo = (user) => {
        FacebookLoginHelper.getUserInfomation((userName, imageUrl) => {
            user.updateProfile({
                displayName: userName,
                photoURL: imageUrl
            }).then(function() {
                // Update successful.
            }).catch(function(error) {
                // An error happened.
            });
        })
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