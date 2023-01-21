/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useCallback, useRef} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Pressable,
  View, 
  TouchableOpacity,
  Image,
  Platform,
  Easing,
  Animated, 
  AppState,
} from 'react-native';

import Touchable from './Touchable';

import Lottie from 'lottie-react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Picker} from '@react-native-picker/picker';
import {
  WheelPicker,
  TimePicker,
  DatePicker
} from "react-native-wheel-picker-android"; 
// import Picker from "react-native-animated-wheel-picker";
import Sound from 'react-native-sound';
 
 

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [secondsSelected, setSecondsSelected] = useState(0);
  const [minsSelected, setMinsSelected] = useState(0);


  const [timerCount, setTimer] = useState(0)   
  const [timerState, setTimerState] = useState(0)

  const timerProgress = useRef(new Animated.Value(0))

  
  const [sleepLottieProgress, setSleepLottieProgress] = useState(true);
 
  const animationProgress = useRef(new Animated.Value(0))
  const [animValue, setAnimValue] = useState(0)


  const fadeAnimationProgress = useRef(new Animated.Value(1.0))
  const [fadeAnimValue, setFadeAnimValue] = useState(1.0)


  const stopButtonOpacityProgress = useRef(new Animated.Value(0.0))
  const [stopButtonOpacity, setStopButtonOpacity] = useState(0.0)



  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackInstance, setPlaybackInstance] = useState(null);

  const [dimensions, setDimensions] = useState({ width: 300, height: 100, hitslop:0 });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const secondsData = [...Array(60).keys()].map(String)
  const minutesData = [...Array(15).keys()].map(String)



  //Background and foreground notifications
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('---------App has come to the foreground! - resuming animations');
        this.SleepTextAnimation.play();
        this.PickerIdleAnimation.play()
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);







  let picker;
  if(Platform.OS == 'android'){
    picker = <View style={{flex:1, flexDirection:"row", justifyContent:"center", alignItems:'center',  paddingRight:40, paddingLeft:40,  borderColor:"#ff0000", borderWidth:2}}> 
    <Lottie  
              renderMode='HARDWARE'
      style={{height:160, width:380, position:'absolute',  alignSelf:'center' }} 
      source={require('./Assets/PickerBackgroundShadow.json')}
      autoPlay={true}
      loop
      >    
    </Lottie>


    <View style={{height:140, width:340, position:'absolute',  alignSelf:'center',}}>
      { timerState != 2 ?
      <Lottie  
      renderMode='HARDWARE'
          style={{height:140, width:340, position:'absolute',  alignSelf:'center' }} 
          source={require('./Assets/PickerBackground.json')}
          autoPlay={true}
          loop
        >    
      </Lottie>

      
      :
      <Lottie  
      renderMode='HARDWARE'
          style={{height:140, width:340, position:'absolute',  alignSelf:'center',  }} 
          source={require('./Assets/PickerBackgroundCountdown.json')}
          progress={timerProgress.current} 
      >   
      </Lottie>
      }
    </View>


    <View style={{flex:1, justifyContent:'center', alignItems:'flex-end', paddingRight:10,  }}>
      <WheelPicker
        style={{width: 140, height: 120,  marginBottom:5}}
        selectedItemTextColor='#3B4E59'
        indicatorColor='#3B4E59'
        selectedItemTextSize={19}
        itemTextColor='#3B4E59' 
        indicatorWidth={3}
        initPosition={0}
        selectedItem={minsSelected}
        data={minutesData}
        onItemSelected={

          (res) => {setMinsSelected(res)
                    console.log('res')
                    console.log(res)
                    console.log(typeof(res))}}
      />
    </View> 
       
    <View style={{flex:1,  justifyContent:'center', alignItems:'flex-start', paddingLeft:10,   }}>
      <WheelPicker
          style={{ width: 140, height: 120,  marginBottom:5}}
          selectedItemTextColor='#3B4E59'
          indicatorColor='#3B4E59'
          selectedItemTextSize={19}
          itemTextColor='#3B4E59' 
          indicatorWidth={3}
          initPosition={0}
          selectedItem={secondsSelected}
          data={secondsData}
          onItemSelected={(res) => setSecondsSelected(res)}
      /> 
    </View>  
  </View> 

  }
  else{
    picker = <View style={{flex:1, flexDirection:"row", justifyContent:"center", alignItems:'center',   paddingRight:40, paddingLeft:40,      }}> 
    {/* <Lottie  
      style={{height:160, width:380, position:'absolute',  alignSelf:'center' }} 
      source={require('./Assets/PickerBackgroundShadow.json')}
      autoPlay={true}
      loop
      >    
    </Lottie> */}
    <Image
        style={{width:360, height: 225,  position:'absolute',  alignSelf:'center', marginTop:10}}
        source={require('./Assets/PickerBackgroundiOS.png')}
    />
      
 

    <View style={{height:225, width:360, position:'absolute', alignSelf:'center', }}>
      { (timerState != 2) ?
 
      <Lottie  
          ref={animation => {
            this.PickerIdleAnimation = animation;
          }}
          style={{height:225, width:360, position:'absolute', alignSelf:'center', }} 
          source={require('./Assets/PickerIdleiOS.json')}
          autoPlay={true}
          loop
        >    
      </Lottie>
      :
      <Lottie  
      renderMode='HARDWARE'
      style={{height:225, width:360, position:'absolute', alignSelf:'center', }} 
      source={require('./Assets/PickerCountdown.json')}
      progress={timerProgress.current} 

      // autoPlay={true}
      // loop
      >   
      </Lottie>
      

      }
    </View>


    <View style={{flex:1, justifyContent:'center', alignItems:'flex-end',   }}>

    <Picker
      style={{ width: 120, height: 0,   marginBottom:218, alignSelf:'center', marginLeft:10   }}
      selectedValue={minsSelected}
      itemStyle={{ color: '#3b4e59' , fontWeight:'500' }}
      onValueChange={(itemValue, itemIndex) => {
        console.log('mins selected')
        console.log(typeof(itemValue))
        console.log(itemValue)
        setMinsSelected(itemValue)
      }
      }>
      {minutesData.map((item) => (
        <Picker.Item label={item}  value={item} key={item} />
      ))}
    </Picker>
    </View> 
       
    <View style={{flex:1,  justifyContent:'center', alignItems:'flex-start',      }}> 
    <Picker  
      style={{ width: 120, height: 0, marginBottom:218, alignSelf:'center', marginRight:25,  }}
      selectedValue={secondsSelected}
      itemStyle={{ color: '#3b4e59' , fontWeight:'500' }}
      onValueChange={(itemValue, itemIndex) =>{
        console.log('mins selected')
        console.log(typeof(itemValue))
        console.log(itemValue)
        setSecondsSelected(itemValue)
      }
      }>
      {secondsData.map((item) => (
        <Picker.Item label={item} value={item} key={item} />
      ))}
    </Picker>
    </View>  
  </View> 






    

  }


  const alarm = useCallback(() => {
    togglePlayback()
    console.log("ALARM!!!!!!!!!!!!!!!!!!!~~~~~~")
});




  //Audio Use Effect
  useEffect(() => {
    console.log("------------- INSIDE USEEFFECT() AUDIO-----------------")
    Sound.setCategory('Playback');
 
    const source = {
      uri: './Assets/Alarm.mp3' 
    };

    const initializePlaybackInstance = async () => {
      const instance = new Sound('Alarm.mp3', Sound.MAIN_BUNDLE, error => {
        console.log('what the fuck')
        if (error) {
          console.log("Creating instance error")
          console.log(error);
          console.log("After creating instance error")
          return;
        }
        console.log("before setPlaybackInsatnce")
        setPlaybackInstance(instance);
        console.log("after setPlaybackInsatnce")
        //setIsPlaying(true);

        console.log('isPlaying')
        console.log(isPlaying)
        try{
        if(isPlaying){
          playbackInstance.setVolume(1)
          playbackInstance.play(success => {
            if (success) {
              console.log('successfully finished playing');
              setIsPlaying(false);
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }
        else{ 
          if(playbackInstance != null){
            playbackInstance.stop(() => {
              // Note: If you want to play a sound after stopping and rewinding it,
              // it is important to call play() in a callback.
              //whoosh.play();
            });
          }
          else{
            console.log("PlaybackInstance is null")
          }
        }
      }
      catch(e) { console.error(e); }


      });
    };

    //if (playbackInstance === null) {
      console.log('playbackInstance is Null calling initializePlaybackInstance()')
      initializePlaybackInstance();
    // } else {
    //   if (isPlaying) {
    //     console.log('playbackInstance .play()')
    //     playbackInstance.setVolume(1)
    //     playbackInstance.play(success => {
    //       if (success) {
    //         console.log('successfully finished playing');
    //       } else {
    //         console.log('playback failed due to audio decoding errors');
    //       }
    //     });
    //   } else {
    //     console.log('playbackInstance .pause()')
    //     playbackInstance.pause();
    //   }
    // }

    return () => {
      if (playbackInstance !== null) {
        playbackInstance.release();
      }
    };
  }, [isPlaying]);

 
  const togglePlayback = () => {
    console.log('calling togglePlayback() ----------------')
    setIsPlaying(!isPlaying);
  };

  const fadeOutAudio = () => {
    if (playbackInstance !== null) {
      const interval = setInterval(() => {
        playbackInstance.setVolume(playbackInstance.getVolume() - 0.1);
        if (playbackInstance.getVolume() <= 0) {
          clearInterval(interval);
          setIsPlaying(false);
        }
      }, 100);
    }
  };



   useEffect(() => {
     console.log("------------- INSIDE USEEFFECT()-----------------")

    animationProgress.current.addListener((progress)=>{ 
      setAnimValue(progress.value)
    })
    
    fadeAnimationProgress.current.addListener((progress)=>{ 
      // console.log(progress.value)
      // console.log(typeof(progress.value))
      setFadeAnimValue(progress.value)
    })


    stopButtonOpacityProgress.current.addListener((progress)=>{ 
      // console.log(progress.value)
      // console.log(typeof(progress.value))
      setStopButtonOpacity(progress.value)
    })



    console.log("INside Use effect")
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
          lastTimerCount <= 1 && clearInterval(interval)
          console.log(lastTimerCount)
          if(lastTimerCount <= 1 && timerState == 2){ 
            console.log("setTimerState(0)")
            //setTimerState(0)      
            clearInterval(interval)
            alarm() 
            //fadeIn()   
            //fadeAnimationProgress.current.resetAnimation() // Reset Sleep Anim
          }
          else if(isNaN(lastTimerCount)){
            console.log("Clean Up???") 
            clearInterval(interval)
            //setTimerState(0)  
          }
          return lastTimerCount - 1 
      }) 
    }, 1000) //each count lasts for a second 
    //cleanup the interval on complete
    console.log("Clean Up???") 
    return () => {clearInterval(interval) 
                  animationProgress.current.removeAllListeners();}
  }, [timerState]);   


  const expandOnHold = () => {

    // Expand touchable area of sleep button
    setDimensions({
      width: 400,
      height: 300,
      hitslop:100
    });

    Animated.timing(animationProgress.current, {
      toValue: 1.0,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false
    }).start(({finished}) => {
      if (finished) {
          console.log('animation ended!')
          setTimerState(1)
      }
  })
  }

  // const breathOnHold = () => { 
  //   animationProgress.setValue(0.75)
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(animationProgress.current, {
          
  //         toValue: 0.75,
  //         duration: 1000, 
  //         useNativeDriver: false
  //       }),
  //       Animated.timing(animationProgress.current, {
  //         toValue: 1.0,
  //         duration: 1000, 
  //         useNativeDriver: false
  //       })
  //     ]),
  //     {
  //       iterations: 4
  //     }
  //   ).start()
  // }

  const shrinkOnRelease = () => {
    setDimensions({
      width: 300,
      height: 100,
      hitslop: 0
    });
    Animated.timing(animationProgress.current, {
      toValue: 0,
      duration: 1000 * animValue,
      easing: Easing.linear,
      useNativeDriver: false
    }).start(); 
  }


  timerAnimation = () => {
    console.log("----------------------timerAnimation----------------------")
    Animated.timing(timerProgress.current, {
      toValue: 1.0,
      duration: 1000 * (parseInt(secondsSelected) + (parseInt(minsSelected) * 60)),
      useNativeDriver: false
    }).start(({finished}) => {
      if (finished) { 
        console.log('resetting timer animation')
      }
  })
  };


  // Sleep Fade in and Out
  fadeIn = () => {
    Animated.timing(fadeAnimationProgress.current, {
      toValue: 1.0,
      duration: 500,
      useNativeDriver: false
    }).start();
  };

  fadeOut = () => {
    Animated.timing(fadeAnimationProgress.current, {
      toValue: 0.0,
      duration: 500, 
      useNativeDriver: false
    }).start();

    setSleepLottieProgress(false)
  };


  fadeOutStopButton = () => {
    Animated.timing(stopButtonOpacityProgress.current, {
      toValue: 0.0,
      duration: 2000, 
      useNativeDriver: false
    }).start();
 
  };

  fadeInStopButton = () => {
    Animated.timing(stopButtonOpacityProgress.current, {
      toValue: 1.0,
      duration: 10, 
      useNativeDriver: false
    }).start();
 
  };


//   var SleepAnimated =           <Lottie  
//   renderMode='HARDWARE'
//   style={[{height:79.5, width:252, marginTop:1, alignSelf:'center', position:'absolute', borderWidth:1, borderColor:"#ff0000"  }, { opacity:fadeAnimValue}]}
//   // progress={sleepLottieProgress}
//   source={require('./Assets/Sleep.json')} 
//   autoPlay={sleepLottieProgress}
//   loop
// > 
// </Lottie>
 
  return ( 
      <View style={{flex:1,  backgroundColor:'#e3d3e4', }}>



        {/* <Lottie 
              renderMode='HARDWARE'
          style={{ resizeMode:"cover", position:'absolute' }}
          source={require('./Assets/BackGroundiOS.json')}
          autoPlay
          loop
          >
        </Lottie> */}

        <Image
        style={{resizeMode:"contain", position:'absolute'}}
        source={require('./Assets/BackgroundStilliOS.png')}
    />







        {picker}







        
        <View>
        {/* <Text style={{color:'#ffffff'}}>Mins: {minsSelected}</Text>
        <Text style={{color:'#ffffff'}}>Seconds: {secondsSelected}</Text>
        <Text style={{color:'#ffffff'}}>anim: {animValue}</Text> */}
        {/* <Text style={{color:'#ffffff'}}>anim: {fadeAnimValue}</Text>  */}
        {/* <Text style={{color:'#ffffff'}}>{timerCount}</Text>
        <Text style={{color:'#ffffff'}}>{timerState}</Text> */}
        </View>
        <View style={{ height:50, width:50, alignSelf:'center',  }}>
          <Pressable style={{flex:1, justifyContent:'center', alignItems:'center', margin:0,   }} 
            
           activeOpacity={1.0}
            onPress={()=>
            {
              console.log('onPress')
              setIsPlaying(false);
              fadeOutStopButton();
              setTimerState(0) 
              fadeIn()
            }
          }
 
            >
            <Lottie 
              renderMode='HARDWARE'
              ref={animation => {
                this.StopButtonAnimation = animation;
              }}
              style={[{ flex:1, alignSelf:'center', position:'absolute' }, { opacity:stopButtonOpacity}]}
              source={require('./Assets/StopButton.json')}
              autoPlay 
              loop={false}>
              
            </Lottie>
          </Pressable>
        </View>


        <View style={{flex:1, /*borderColor:'#00ff00', borderWidth:2*/ justifyContent:'center', alignItems:'center',/**/}}>
        <Lottie 
            style={{/*height:400, width:412, borderColor:'#ffff00', borderWidth:0, alignSelf:'center', borderWidth:1, borderColor:"#ff0000" position:'absolute'*/}}
            source={require('./Assets/ButtonBaseMod.json')} 
            progress={animationProgress.current}> 
          </Lottie> 
           
          {/* {SleepAnimated} */}
          <Lottie  
            ref={animation => {
              this.SleepTextAnimation = animation;
            }}
            style={[{height:79.5, width:252, marginTop:1, alignSelf:'center', position:'absolute',    }, { opacity:fadeAnimValue}]}
            // progress={sleepLottieProgress}
            source={require('./Assets/Sleep.json')} 
            autoPlay={sleepLottieProgress}
            loop
        > 
        </Lottie>
          <Pressable style={{ width: dimensions.width, height: dimensions.height,/*width:400, height:300,*//*width:300, height:100,*/ justifyContent:'center', alignItems:'flex-start', margin:0, /*borderColor:'#0000ff', borderWidth:6 ,*/ marginLeft:70,  marginRight:70, marginTop:170, marginBottom:170}} 
            disabled={timerState != 0}
             //as={TouchableOpacity}
             //activeOpacity={1.0}
             hitSlop={dimensions.hitslop}
             onPress={()=>console.log('onPress')}
             onPressIn={()=>
              {
                console.log('onPressIn')
                expandOnHold()
                fadeOut()
                
              }
            }
             onPressOut={()=>
             {  
                console.log('onPressOut')
                if(timerState == 1)
                { 
                  
                  timerProgress.current.setValue(0.0);
                  console.log("Begin Timer !")
                  setTimer(parseInt(secondsSelected) + (parseInt(minsSelected) * 60)) 
                  console.log("setTimerState(1)")
                  setTimerState(2)   // Set timerState to Timer has started
                  shrinkOnRelease()  // Shrink Sleep Button
                  
                  timerAnimation() // Start timer for animation
                  fadeInStopButton()
                  this.StopButtonAnimation.play();
                }
                else if(timerState == 0)
                {
                  shrinkOnRelease()  
                  fadeIn()
                   
                  //fadeAnimationProgress.current.resetAnimation()// Reset Sleep Anim

                }
                else
                { 
                  console.log("Timer Already Running! or Canceled")
                }         
             }
          } 
             >

          {/* <Lottie  
            style={[{height:600, width:700, marginTop:6, alignSelf:'center',  borderColor:'#ffffff',}, { opacity:fadeAnimValue}]}
            // progress={sleepLottieProgress}
            source={require('./Assets/Sleep.json')}
            autoPlay={sleepLottieProgress}
            loop
          > 
          </Lottie> */}

          </Pressable> 

        </View> 
      </View>
 
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: { 
    fontWeight: '700',
  },
});

export default App;
