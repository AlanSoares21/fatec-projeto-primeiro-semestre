import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Link, useFocusEffect } from 'expo-router';
import { username } from '@/components/CommomDataContext';

export default function HomeScreen() {
  const [user, setUser] = useState<{name: string}>();

  const [lastLecture, setLastLecture] = useState();

  useFocusEffect(() => {
    username.get().then(name => {
      if (name) 
        setUser({name});
      else
        setUser(undefined)
    })
  });

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome {user ? user.name : ""}!</ThemedText>
        <HelloWave />
      </ThemedView>
      <Link href='/login'>
        <ThemedText type='defaultSemiBold'>
          {
            !user ?
            "login"
            :
            "logoff"
          }
        </ThemedText>
      </Link>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
