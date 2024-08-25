import { TLastLiteraryWork } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const username = {
    set(value: string) {
        return AsyncStorage.setItem('username', value)
    },
    get() {
        return AsyncStorage.getItem('username')
    }
}

export const literaryWorksToShow = {
    set(value: TLastLiteraryWork[]) {
        return AsyncStorage.setItem('lastLiteraryWorks', JSON.stringify(value))
    },
    get() {
        return AsyncStorage.getItem('lastLiteraryWorks')
            .then(i => i ? JSON.parse(i) as TLastLiteraryWork[] : undefined)
    }
}