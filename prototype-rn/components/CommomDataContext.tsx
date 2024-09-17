import { TLastLiteraryWork, TLiteraryWork, TLiteraryWorkChapter } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {documentDirectory, readAsStringAsync} from 'expo-file-system'

export const username = {
    set(value: string) {
        return AsyncStorage.setItem('username', value)
    },
    get() {
        return AsyncStorage.getItem('username')
    }
}

export function clearData() {
    return AsyncStorage.clear();
}

export const literaryWorksToShow = {
    set(value: TLiteraryWork[]) {
        return AsyncStorage.setItem('lastLiteraryWorks', JSON.stringify(value))
    },
    get() {
        return AsyncStorage.getItem('lastLiteraryWorks')
            .then(i => i ? JSON.parse(i) as TLiteraryWork[] : undefined)
    }
}

export async function getWorkData(workId: number) {
    let works = await literaryWorksToShow.get();
    if (works)
        return works[workId];
    return undefined;
}

function randomInteger() {
    return Math.round(Math.random() * 10);
}

function randomText() {
    return "este e um texto provisorio";
}

async function setText(workid: number) {
    return AsyncStorage.setItem('works-text-' + workid, randomText());
}

const getTextFromStorage = (workId: number) => 
    AsyncStorage.getItem('work-' + workId)
    .then(i => i ? i : undefined);

export async function getWorkText(workId: number) {
    let text = await getTextFromStorage(workId);
    if (text === undefined) {
        await setText(workId)
        return getTextFromStorage(workId);
    }
    return text;
}

export function getContent(chapter: TLiteraryWorkChapter) {
    return readAsStringAsync(documentDirectory + chapter.filePath)
}