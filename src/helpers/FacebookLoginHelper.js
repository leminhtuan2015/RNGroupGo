const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager
} = FBSDK;

import StatusTypes from "../constants/StatusTypes"

class FacebookLoginHelper {

    static getCurrentAccessToken = () => {
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

    static login = () => {
        return LoginManager.logInWithReadPermissions(['public_profile']).then(
            (result) => {
                if (result.isCancelled) {
                    return StatusTypes.CANCELED
                } else {
                    return StatusTypes.SUCCESS
                }
            },
            function(error) {
                StatusTypes.FAILED
            }
        );
    }

    static logOut = () => {
        return LoginManager.logOut()
    }

    static getUserInfomation = () => {
        // const infoRequest = new GraphRequest("/me?fields=name,picture", null,
        //     (error, result) => {
        //         if (error) {
        //             console.log("getUserInfomation Failed : " + JSON.stringify(error))
        //             return null
        //         } else {
        //             const imageUrl = result.picture.data.url
        //             const userName = result.name
        //
        //             console.log("userName : " + userName)
        //             console.log("imageUrl : " + imageUrl)
        //
        //             return {userName: userName, imageUrl: imageUrl}
        //         }
        //     }
        // )
        //
        // return (new GraphRequestManager().addRequest(infoRequest).start())

        const facebookParams = "id,name,email,picture.width(600).height(800)";

        return new Promise((resolve, reject) => {
            const profileInfoCallback = (error, profileInfo) => {
                if (error){
                    reject(error);
                }

                const userInfomation = {userName: profileInfo.name, imageUrl: profileInfo.picture.data.url}

                resolve(userInfomation)
            };

            const profileInfoRequest = new GraphRequest(
                "/me",
                {
                    parameters: {
                        fields: {
                            string: facebookParams
                        }
                    }
                },
                profileInfoCallback
            );

            new GraphRequestManager().addRequest(profileInfoRequest).start();
        });
    }
}

export default FacebookLoginHelper