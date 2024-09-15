/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the theme configuration for the application
 */

import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    }
});

export default theme