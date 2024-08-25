import AsyncStorage from '@react-native-async-storage/async-storage';

export const username = {
    set(value: string) {
        return AsyncStorage.setItem('username', value)
    },
    get() {
        return AsyncStorage.getItem('username')
    }
}