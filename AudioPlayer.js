import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Sound from 'react-native-sound';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackInstance, setPlaybackInstance] = useState(null);

  useEffect(() => {
    Sound.setCategory('Playback');

    const source = {
      uri: './Assets/Alarm.mp3'
    };

    const initializePlaybackInstance = async () => {
      const instance = new Sound(source, error => {
        if (error) {
          console.log(error);
          return;
        }
        setPlaybackInstance(instance);
        setIsPlaying(true);
      });
    };

    if (playbackInstance === null) {
      initializePlaybackInstance();
    } else {
      if (isPlaying) {
        playbackInstance.play();
      } else {
        playbackInstance.pause();
      }
    }

    return () => {
      if (playbackInstance !== null) {
        playbackInstance.release();
      }
    };
  }, [isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const fadeOut = () => {
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

  return (
    <View>
      <TouchableOpacity onPress={togglePlayback}>
        <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={fadeOutAudio}>
        <Text>Fade Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AudioPlayer;
