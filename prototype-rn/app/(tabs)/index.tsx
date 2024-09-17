import { View, Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { Link, router, useFocusEffect } from 'expo-router';
import { clearData, literaryWorksToShow, username } from '@/components/CommomDataContext';
import LiteraryWorkCard from '@/components/basic/LiteraryWorkCard';
import ThemedBtn from '@/components/ThemedBtn';
import { TLastLiteraryWork, TLiteraryWork } from '@/constants/types';

export default function HomeScreen() {
    const [user, setUser] = useState<{name: string}>();

    const [lastLiteraryWorks, setLastLiteraryWorks] = useState<TLiteraryWork[]>();

    useEffect(() => {
        console.log("oi");
        let isActive = true;
        username.get().then(name => {
            if (!isActive)
                return;
            if (name) 
                setUser({name});
            else
                setUser(undefined)
        })

        literaryWorksToShow.get().then(data => {
            if (!isActive)
                return;
            if (data)
                setLastLiteraryWorks(data)
            else
                setLastLiteraryWorks(undefined)
        })

        return () => {isActive = false};
    }, []);

    return (
        <ParallaxScrollView>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome {user ? user.name : ""}!</ThemedText>
                <HelloWave />
            </ThemedView>
            <View style={{gap: 8}}>
                {
                    lastLiteraryWorks &&
                    lastLiteraryWorks.map((work, i) => 
                        <LiteraryWorkCard
                            key={'key-'+i}
                            left={
                                <Image 
                                    source={require('@/assets/images/open-book.png')} 
                                    style={{ alignSelf: 'center' }} 
                                />
                            }
                            rigth={<View style={{gap: 4}}>
                                <ThemedText type='subtitle'>{work.title}</ThemedText>
                                <ThemedBtn 
                                    title={`Você parou no capitulo 1`} 
                                    onPress={() => router.navigate('/read/' + work.id + '/0')}
                                />
                                <ThemedBtn 
                                    title="ver dicussões" 
                                    onPress={() => router.navigate('/workdiscussion/' + i)}
                                />
                            </View>}
                        />
                    )
                }
            </View>
            <ThemedBtn 
                title={!user ? 'login' : 'logoff'} 
                onPress={() => {
                    clearData().then(() => router.replace('/login'))
                }}
            />
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
