// 'use client'

// import { ThemeProvider } from 'next-themes'

// export function Providers({ children }: { children: React.ReactNode }) {
//     return <ThemeProvider attribute="class" defaultTheme='system' enableSystem>{children}</ThemeProvider>
// }

// import { ThemeProvider } from 'next-themes'
// import { type ThemeProviderProps } from 'next-themes/dist/types';


// export function Providers({ children }: { children: React.ReactNode }) {
//      // @ts-ignore
//     return (
//         <ThemeProvider attribute="class" defaultTheme='system' enableSystem>
//             {children}
//         </ThemeProvider>
//     ) as any
// }



import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export const ThemeProvider = (props: ThemeProviderProps): React.JSX.Element => {
    return NextThemesProvider(props) as React.JSX.Element;
};