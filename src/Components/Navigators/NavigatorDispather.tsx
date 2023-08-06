import { useTheme } from "@mui/material/styles"
import { useMediaQuery } from "@mui/material"
import NavigatorPortrait from "./NavigatorPortrait"
import Navigator from "./Navigator"
import { ItemType } from "../../Model/ItemType"

const NavigatorDispather:React.FC<{navItem:ItemType[]}> = (nav) => {
    const theme = useTheme()
    
    const isPortrait = useMediaQuery(theme.breakpoints.down('md'));
    return isPortrait ? <NavigatorPortrait navItem={nav.navItem}/> : <Navigator navItem={nav.navItem}/>
}

export default NavigatorDispather;