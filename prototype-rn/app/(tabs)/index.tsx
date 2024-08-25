import { View, Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Link, useFocusEffect } from 'expo-router';
import { username } from '@/components/CommomDataContext';
import LiteraryWorkCard from '@/components/basic/LiteraryWorkCard';
import ThemedBtn from '@/components/ThemedBtn';

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
            <View style={{gap: 8}}>
                {
                    ([1, 2, 3, 4, 5])
                    .map(i => 
                        <LiteraryWorkCard 
                            key={`key-${i}`}
                            left={
                                <View>
                                    <Image 
                                        source={require('@/assets/images/react-logo.png')} 
                                        style={{ alignSelf: 'center' }} 
                                    />
                                </View>
                            }
                            rigth={<View style={{gap: 4}}>
                                <ThemedText type='subtitle'>Title</ThemedText>
                                <ThemedText type='default'>Some information</ThemedText>
                                <ThemedBtn title="i'm reading" />
                                <ThemedBtn title="i stoped read" />
                            </View>}
                        />
                    )
                }
            </View>
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
