import React, { Component } from 'react';
import {Image}
  from "react-native"


const ImageManager = (image) => {
   
   if(image == "sunny"){
     return (
           <Image
             style={{width: 32, height: 32}}
             source={require("../resources/images/sunny.png")} />
      )
   } else if(image == "rainny") {
      return (
           <Image
             style={{width: 32, height: 32}}
             source={require("../resources/images/rain.png")} />
      )

   } else if(image == "cloudy") {
      return (
           <Image
             style={{width: 32, height: 32}}
             source={require("../resources/images/cloudy.png")} />
      )

   } else if(image == "storm") {
      return (
           <Image
             style={{width: 32, height: 32}}
             source={require("../resources/images/storm.png")} />
      )

   }


}

export default ImageManager
