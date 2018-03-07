const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager
} = FBSDK;

class FacebookLoginHelper {

    static login = (callback) => {
        FacebookLoginHelper.getCurrentAccessToken((accessToken) => {
            if(accessToken){
                // LoggedIn
                // alert("LoggedIn : " + accessToken)
                callback(accessToken)
            } else {
                FacebookLoginHelper.loginWithPermissions((accessToken) => {
                    // alert("accessToken : " + accessToken)
                    callback(accessToken)
                })
            }
        })
    }

    static getCurrentAccessToken = (callback) => {
        AccessToken.getCurrentAccessToken().then(
            (data) => {
                if(data){
                    callback(data.accessToken)
                } else {
                    callback(null)
                }
            }
        )
    }

    static getCurrentAccessTokenSaga = () => {
        return AccessToken.getCurrentAccessToken().then(
            (data) => {
                if(data){
                    return data.accessToken
                } else {
                    return null
                }
            }
        )
    }

    static loginWithPermissions = (callback) => {
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            (result) => {
                if (result.isCancelled) {
                    alert('Login cancelled');
                } else {
                    FacebookLoginHelper.getCurrentAccessToken(callback)
                }
            },
            function(error) {
                alert('Login fail with error: ' + error);
            }
        );
    }

    static logOut = () => {
        LoginManager.logOut()
    }

    static getUserInfomation = (callback) => {
        const infoRequest = new GraphRequest("/me?fields=name,picture",
            null,
            (error, result) => {
                if (error) {
                    callback(null, null)
                } else {
                    const imageUrl = result.picture.data.url
                    const userName = result.name

                    console.log("userName : " + userName)
                    console.log("imageUrl : " + imageUrl)

                    callback(userName, imageUrl)
                }
            }
        )

        new GraphRequestManager().addRequest(infoRequest).start();
    }
}

export default FacebookLoginHelper