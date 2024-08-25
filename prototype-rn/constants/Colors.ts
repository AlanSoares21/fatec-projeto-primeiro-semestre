/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

type TThemeColor = {
  dark: string;
  light: string;
}

const tint: TThemeColor = {
  light: '#0a7ea4',
  dark: '#fff'
}

export const Colors = {
  light: {
    text: '#11181C',
    background: '#60D4E1',
    btnBackground: '#D65555',
    inputBackground: '#D9D9D9',
    tint: tint.light,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tint.light,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    btnBackground: '#D65555',
    inputBackground: '#D9D9D9',
    tint: tint.dark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tint.dark,
  },
};
