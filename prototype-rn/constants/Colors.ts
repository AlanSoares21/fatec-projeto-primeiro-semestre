/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

type TThemeColor = {
  dark: string;
  light: string;
}

const tint: TThemeColor = {
  light: '#fff',
  dark: '#fff'
}

const commom = {
  btnBackground: '#D65555',
  tabBarBackgroundActive: '#D65555',
  tabBarBackground: '#BE4B4B',
  inputBackground: '#D9D9D9',
  imageBackground: '#E7E7E7',
}

export const Colors = {
  light: {
    ...commom,
    text: '#11181C',
    background: '#60D4E1',
    tint: tint.light,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tint.light,
  },
  dark: {
    ...commom,
    text: '#ECEDEE',
    background: '#151718',
    tint: tint.dark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tint.dark,
  },
};
