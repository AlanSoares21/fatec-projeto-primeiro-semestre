import { View, Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Link, router, useFocusEffect } from 'expo-router';
import { literaryWorksToShow, username } from '@/components/CommomDataContext';
import LiteraryWorkCard from '@/components/basic/LiteraryWorkCard';
import ThemedBtn from '@/components/ThemedBtn';
import { TLastLiteraryWork } from '@/constants/types';

export default function HomeScreen() {
    const [user, setUser] = useState<{name: string}>();

    const [lastLiteraryWorks, setLastLiteraryWorks] = useState<TLastLiteraryWork[]>();

    useFocusEffect(() => {
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
    });

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
                                    source={require('@/assets/images/react-logo.png')} 
                                    style={{ alignSelf: 'center' }} 
                                />
                            }
                            rigth={<View style={{gap: 4}}>
                                <ThemedText type='subtitle'>{work.title}</ThemedText>
                                {/*<ThemedText type='default'>Some information</ThemedText>*/}
                                <ThemedBtn 
                                    title={`Você parou no capitulo ${work.chapter.chapter}`} 
                                    onPress={() => router.navigate('/workdiscussion/' + i)}
                                />
                                <ThemedBtn title="ver dicussões" />
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
