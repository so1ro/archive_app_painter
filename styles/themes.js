import { extendTheme } from "@chakra-ui/react"
import { text_color } from '@/styles/colorModeValue'
import { createBreakpoints } from "@chakra-ui/theme-tools"

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
            // "*:focus": {
            //     boxShadow: "none!important" // Delete Blue border from all clickable elements
            // }
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

export default theme;

//// FontSize Basic /////
// fontSize={{ base: 'md', lg: 'xl' }}