import { getContent, getWorkData, getWorkText, literaryWorksToShow } from "@/components/CommomDataContext";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TLastLiteraryWork, TLiteraryWork } from "@/constants/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { documentDirectory } from "expo-file-system";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, View } from 'react-native';

function getReactElement(key: string, ch: (JSX.Element | string)[], tag?: string) {

    if (tag === 'div')
        return <ThemedView key={key} children={ch}></ThemedView>;
    if (tag === 'p')
        return <ThemedText key={key} type="default" children={ch}></ThemedText>;
    if (tag === 'i')
        return <ThemedText key={key} type="default" children={ch}></ThemedText>;
    if (tag === 'b')
        return <ThemedText key={key} type="defaultSemiBold" children={ch}></ThemedText>;
    
    return <ThemedText key={key} children={ch}></ThemedText>    
}

function makeReactComponentFromText(text: string) {
    function getTag(open: number, close: number) {
        let str = text.substring(open, close)
        if (str.includes('div'))
            return 'div';
        if (str.includes('i'))
            return 'i';
        if (str.includes('b'))
            return 'b';
        if (str.includes('p'))
            return 'p';
        return undefined;
    }
    function findNextChar(current: number, char: string) {
        for(let i = current + 1; i < text.length; i++) {
            if (text[i] === char) {
                return i
            }
        }
        return undefined;
    }
    function getElement(current: number, elementTag: string, keyToIncrement: string): {
        e: JSX.Element;
        currentIndex: number;
    } {
        let lastText = ''
        const children: Array<React.JSX.Element> = []
        let lastIndex = current;
        for(let i = current + 1; i < text.length; i++) {
            if (text[i] === '<') {
                let closeTagAt = findNextChar(i, '>')
                if (closeTagAt === undefined) {
                    // error
                    break;
                }
                let tag = getTag(i, closeTagAt);
                if (tag === undefined) {
                    // error
                    break;
                }
                let closeElementAt = findNextChar(i, '/');
                if (closeElementAt === undefined) {
                    // error
                    break;
                }
                if (closeElementAt < closeTagAt && tag === elementTag) {
                    lastIndex = closeTagAt;
                    break;
                }
                children.push(getReactElement(keyToIncrement + '-' + children.length, [lastText], 'p'));
                lastText = "";
                let result = getElement(closeTagAt, tag, keyToIncrement + '-' + children.length);
                children.push(result.e);
                i = result.currentIndex;
            }
            else {
                lastText += text[i];
            }
        }
        if (lastText.length > 0)
            children.push(getReactElement(keyToIncrement + '-' + children.length, [lastText], 'p'));

        return {
            e: getReactElement(keyToIncrement + '-' + elementTag, children, elementTag),
            currentIndex: lastIndex
        }
    }
    return getElement(-1, 'div', 'text-container').e;
}

export default function ReadScreen(): React.JSX.Element {
    const imageBackgroundColor = useThemeColor({ }, 'inputBackground')
    const { readworkid: workid, chapterIndex } = useLocalSearchParams();

    const [text, setText] = useState<React.JSX.Element>();
    const [workData, setWorkData] = useState<TLiteraryWork>();

    useEffect(() => {
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
                    if (i === -1)
                        return;
                    setWorkData(l[i])
                    getContent(l[i].chapters[chapterIndexInt])
                        .then(t => {
                            if (!isActive)
                                return;
                            setText(makeReactComponentFromText(t));
                        })
                        .catch(e => {
                            console.log('error on getting chapter content', {e})
                            alert('error on getting chapter content')
                        })
                }
            });
        }
        return () => {isActive = false};
    }, []);

    return <ParallaxScrollView
            headerBackgroundColor={{
                dark: imageBackgroundColor, 
                light: imageBackgroundColor
            }}
        >
        <View style={{marginBottom: 10}}>
            <ThemedText type="title">
                {workData?.title}
            </ThemedText>
        </View>
        {text}
    </ParallaxScrollView>
}