import { extendTheme } from "@chakra-ui/react"
import { text_color } from '@/styles/colorModeValue'
import { createBreakpoints } from "@chakra-ui/theme-tools"
import { keyframes } from "@chakra-ui/react";

const breakpoints = createBreakpoints({
    sm: "480px",
    smd: "600px",
    md: "768px",
    lg: "992px",
    xl: "1280px",
    "2xl": "1480px",
    "3xl": "1536px",
    "4xl": "1680px",
})

const theme = extendTheme({
    breakpoints,
    initialColorMode: "light",
    useSystemColorMode: false,
    fonts: {
        body: "'Noto Serif JP','Merriweather', 'Times New Roman', 'YuMincho', 'Hiragino Mincho ProN', 'Yu Mincho', 'MS PMincho', serif",
        heading: "'Noto Serif JP','Merriweather', 'Times New Roman', 'YuMincho', 'Hiragino Mincho ProN', 'Yu Mincho', 'MS PMincho', serif",
    },
    styles: {
        global: (props) => ({
            html: {
                scrollBehavior: "smooth",
            },
            body: {
                // background: props.colorMode === "dark" ? "#1D2932" : "#edf2f7",
                color: props.colorMode === "dark" ? text_color.d : text_color.l,
                padding: 0,
                margin: 0,
                overflowY: "scroll",
                // fontFamily: "'Noto Serif JP','Merriweather', 'Times New Roman', 'YuMincho', 'Hiragino Mincho ProN', 'Yu Mincho', 'MS PMincho', serif",
            },
            "a": {
                color: "inherit",
                textDecoration: "none"
            },
            "a.active": {
                color: props.colorMode === "dark" ? "#F79F22" : "#E63946",
            },
            "a:hover": {
                textDecoration: "none!important",
            },

            // CSS for pulljs loadingSpinner
            ".ptr--ptr": {
                color: props.colorMode === "dark" ? text_color.d : text_color.l,
                background: props.colorMode === "dark" ? "#1D2932" : "#fff",
            },
            ".ptr--ptr .spinner": {
                animation: `${rotate_loadingSpinner} 2s linear infinite`,
                zIndex: 2,
                margin: "-25px auto 0px",
                width: "24px",
                height: "24px",
            },
            ".ptr--ptr .spinner .path": {
                stroke: props.colorMode === "dark" ? "#F79F22" : "#E63946",
                strokeLinecap: "round",
                animation: `${dash_loadingSpinner} 1.5s ease-in-out infinite`,
            },
        }),
    },
    fontWeights: {
        hairline: 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
    },
});

const rotate_loadingSpinner = keyframes`
100% {
    transform: rotate(360deg);
  }
`

const dash_loadingSpinner = keyframes`
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
`

export default theme;

//// FontSize Basic /////
// fontSize={{ base: 'md', lg: 'xl' }}