import { createContext,useState,useMemo} from "react";
import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";

const tokens = {
    darkPurple: {
        100: "#d5d7e1",
        200: "#aaafc3",
        300: "#8088a4",
        400: "#556086",
        500: "#2b3868",
        600: "#222d53",
        700: "#1a223e",
        800: "#11162a",
        900: "#090b15"
    },
    green: {
        100: "#d4e3d8",
        200: "#a8c7b0",
        300: "#7dab89",
        400: "#518f61",
        500: "#26733a",
        600: "#1e5c2e",
        700: "#174523",
        800: "#0f2e17",
        900: "#08170c"
    },
    blue: {
        100: "#d8e7ff",
        200: "#b0ceff",
        300: "#89b6fe",
        400: "#619dfe",
        500: "#3a85fe",
        600: "#2e6acb",
        700: "#235098",
        800: "#173566",
        900: "#0c1b33"
    },
    purple: {
        100: "#e8e4fb",
        200: "#d1c9f7",
        300: "#bbaef3",
        400: "#a493ef",
        500: "#8d78eb",
        600: "#7160bc",
        700: "#55488d",
        800: "#38305e",
        900: "#1c182f"
    },
    black: {
        100: "#cdcccc",
        200: "#9c9999",
        300: "#6a6666",
        400: "#393333",
        500: "#070000",
        600: "#060000",
        700: "#040000",
        800: "#030000",
        900: "#010000"
    },
    // Neutral colors 
    neutral: {
        100: "#E0E0E0 ", 
        200: "#deeaf2", 
        300: "#cacaca",
        400: "#8088a4", 
        500: "#393333", 
    },
    // Text colors
    text: {
        primary: "#070000", 
        secondary: "#2b3868", 
        disabled: "#9c9999" 
    },

    background: {
        default: "#f5f5f2", 
        paper: "#d5d7e1"
    }
};

const theme = createTheme({
    palette: {
        primary: {
            main: tokens.darkPurple[500],
        },
        secondary: {
            main: tokens.green[500],
        },
        accent: {
            main: tokens.blue[500],  
        },
        background: {
            default: tokens.neutral[100],
            paper: tokens.neutral[200],
        },
        text: {
            primary: tokens.text.primary,
            secondary: tokens.text.secondary,
            disabled: tokens.text.disabled,
        },
    },
    typography:{
        fontFamily:'Inter',
        fontWeightLight:400,
        fontWeightRegular:500,
        fontWeightMedium:600,
        fontWeightBold:700
    }
});

export {theme}