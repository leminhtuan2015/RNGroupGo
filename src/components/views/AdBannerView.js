import React, {Component} from 'react'
import {View} from 'react-native'

import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
} from 'react-native-admob'


const AdBannerView = (props) => {

    return (
        <View style={{height: 65, backgroundColor: "yellow"}}>
            <AdMobBanner
                style={{position: 'absolute', left: 0, right: 0, bottom: 0}}
                adSize="fullBanner"
                adUnitID="ca-app-pub-3940256099942544/6300978111"
                testDevices={[AdMobBanner.simulatorId]}
                onAdFailedToLoad={error => console.error(error)}
            />
        </View>
    )
}
export default AdBannerView
