import { getContent, getWorkData, getWorkText, literaryWorksToShow } from "@/components/CommomDataContext";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { TLastLiteraryWork, TLiteraryWork } from "@/constants/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image } from 'react-native';

export default function ReadScreen(): React.JSX.Element {
    const imageBackgroundColor = useThemeColor({ }, 'inputBackground')
    const { readworkid: workid, chapterIndex } = useLocalSearchParams();

    const [text, setText] = useState<string>();
    const [workData, setWorkData] = useState<TLiteraryWork>();

    useEffect(() => {
        console.log("rodou o use effec")
        let isActive = true;
        if (
            workid !== undefined && typeof workid === "string" &&
            chapterIndex !== undefined && typeof chapterIndex === "string"
        ) {
            let chapterIndexInt = parseInt(chapterIndex)
            literaryWorksToShow.get().then(l => {
                if (!isActive)
                    return;
                if (l) {
                    let i = l.findIndex(v => v.id === workid)
                    if (i === -1) {
                        console.log('index -1', {workid, l})
                        return;
                    }
                    setWorkData(l[i])
                    getContent(l[i].chapters[chapterIndexInt])
                        .then(t => {
                            if (!isActive)
                                return;
                            setText(t);
                        })
                        .catch(e => {
                            console.log('error on getting chapter content', {e})
                            setText('error on getting chapter content')
                        })
                }
                else 
                    console.log('workid ou chapter index tem valor ruim', {workid, chapterIndex})
            });
        }
        else 
            console.log('workid ou chapter index tem valor ruim', {workid, chapterIndex})
        return () => {isActive = false};
    }, []);

    return <ParallaxScrollView
            headerImage={<Image
                style={{width: '100%', height: '100%'}}
                source={require('@/assets/images/react-logo.png')}
            />}
            headerBackgroundColor={{
                dark: imageBackgroundColor, 
                light: imageBackgroundColor
            }}
        >
        <ThemedText type="title">
            {workData?.title}
        </ThemedText>
        <ThemedText>
            {text !== undefined && text}
        </ThemedText>
    </ParallaxScrollView>
}