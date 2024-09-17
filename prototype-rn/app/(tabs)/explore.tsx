import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCallback, useEffect, useState } from 'react';
import * as api from '@/components/Api';
import { TLiteraryWork, TStdList, TStdPaginationQuery } from '@/constants/types';
import LiteraryWorkCard from '@/components/basic/LiteraryWorkCard';
import ThemedBtn from '@/components/ThemedBtn';
import { Link, router, useFocusEffect } from 'expo-router';
import { literaryWorksToShow } from '@/components/CommomDataContext';

const itemsPerPg = 10;

export default function ExploreScreen() {

    const [isSearchingWorks, setIsSearchingWorks] = 
        useState(false);
    const [worksList, setWorksList] = 
        useState<TStdList<TLiteraryWork>>({
            count: 10,
            start: 0,
            data: [],
            total: 0
        });

    const searchWorks = useCallback((qr: TStdPaginationQuery) => {
        let active = true;
        setIsSearchingWorks(true);
        api.listWorks(qr)
            .then(r => {
                if (!active) 
                    return;
                if (api.isApiError(r)) {
                    alert(r.message);
                    return;
                }
                setWorksList(r)
            })
        .finally(() => {
            if (!active) 
                return;
            setIsSearchingWorks(false)
        })
        return () => {
            active = false;
        }
    }, []);

    const readWork = useCallback((work: TLiteraryWork) => {
        api.getChapter(work, 0)
            .then(result => {
                result.downloadAsync()
                .then(async () => {
                    let works = await literaryWorksToShow.get();
                    if (works === undefined)
                        works = [];
                    works.push(work)
                    await literaryWorksToShow.set(works);
                    router.navigate("/(tabs)")
                })
                .catch(e => {
                    console.log('error when downloading file', {e, work})
                    alert('Error when downloading ' + work.title);
                });
            });
    }, []);

    useEffect(() => {
        const cancel = searchWorks({start: 0, count: itemsPerPg})
        return () => {
            cancel();
        }
    }, [])

    return (
        <ParallaxScrollView>
            <ThemedText type="title">Explore</ThemedText>   
            {
                isSearchingWorks ?
                <ThemedText>Searhcing for works...</ThemedText>
                :
                (
                    worksList.count === 0 ?
                    <ThemedText>No works found.</ThemedText>
                    :
                    worksList.data.map(v => 
                        (<LiteraryWorkCard 
                            key={'card-'+v.id} 
                            
                            left={
                                <Image 
                                    source={require('@/assets/images/open-book.png')} 
                                    style={{
                                        alignSelf: 'center', 
                                        maxWidth: '100%',
                                        maxHeight: '100%' 
                                    }} 
                                />
                            }
                            rigth={<View style={{gap: 4}}>
                                <ThemedText type='subtitle'>{v.title}</ThemedText>
                                <ThemedText type='default'>{v.type}</ThemedText>
                                <ThemedText type='default'>Autor: {v.author}</ThemedText>
                                <ThemedBtn 
                                    title={`ler`} 
                                    onPress={() => readWork(v)}
                                />
                                <ExternalLink href={v.source}>Abrir o original</ExternalLink>
                            </View>}
                        />)
                    )
                )
            }
            <View style={{flex: 1, flexDirection: 'row', gap: 4}}>
                <ThemedBtn
                    title='previous'
                    disabled={worksList.start <= itemsPerPg}
                    onPress={() => searchWorks({
                        start: worksList.start - itemsPerPg, 
                        count: itemsPerPg
                    })}
                />
                <ThemedBtn
                    title='next'
                    disabled={worksList.start + itemsPerPg >= worksList.total}
                    onPress={() => searchWorks({
                        start: worksList.start + itemsPerPg, 
                        count: itemsPerPg
                    })}
                />
            </View>
        </ParallaxScrollView>
    );
}
