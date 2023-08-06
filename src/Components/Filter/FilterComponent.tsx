import { Box, Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useRef, useState } from "react";
import {categoryesMap} from "../../Config/category-config"
import { FilterDirection } from "../../Model/FilterDirection";
import { FilterType } from "../../Model/FilterType";
import { CodePayload } from "../../Model/Alert/CodePayload";
import CodeType from "../../Model/Alert/CodeType";
import { useDispatch } from "react-redux";
import { alertAction } from "../../Redux/Slice/AlertMessageSlice";
type Props = {
    callBack:(object:FilterType) => void
}

const allStr:string = "All"

const FilterComponent:React.FC<Props> = (props) => {

    const theme = useTheme();
    const smallDisplay = useMediaQuery(theme.breakpoints.down('sm'));
    const landScape = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch()

    const [currCategory, setCurrCategory] = useState<string>()
    const [direction, setDirection] = useState<FilterDirection>("before")

    const handlerChCategory = (event: SelectChangeEvent) => {
        setCurrCategory(event.target.value)
    }

    const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const codeAlert: CodePayload = {code:CodeType.UNKNOWN,message:''} 
        const data = new FormData(event.currentTarget); 
        const filterObject:FilterType = {
            category:currCategory,
            direction:direction,
            price:Number.parseFloat(`${data.get('price')}`)
        }
        let flag = false;
        for (let key in filterObject){
            if (key != "direction" && filterObject[key as keyof FilterType]) {
                flag = true;
            }
        }

        flag ? props.callBack(filterObject) : codeAlert.message = 'At least one option must be selected'
        dispatch(alertAction.set(codeAlert))
    }


    let categoryes:any[] = [];
    categoryesMap.forEach((__,key) => {
         categoryes.push(<MenuItem value={key}>{key}</MenuItem>)
    })

    return <Box component={"form"} onSubmit={handlerSubmit} sx = {{display:'flex', flexDirection: landScape ? 'column' : 'row', alignItems: landScape ? "center": "end",justifyContent:"center", marginBottom: 3}}>
                <Box sx = {{display:'flex', flexDirection: smallDisplay ? "column" : "row", alignItems: "end", justifyContent:"center"}}>
                <Box sx = {{display:'flex', alignItems: "center", justifyContent:"center" , marginBottom: smallDisplay ? 2 : 0}}>
                    <Box>
                     <FormControl  sx={{marginTop: 1, width:"300px", marginRight: 2}} fullWidth>
                        <InputLabel  id="demo-simple-select-label">Category</InputLabel>
                        <Select itemID="select-id" onChange={handlerChCategory}
                        name="category"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Category">
                        <MenuItem value={undefined}>{allStr}</MenuItem>
                        {categoryes}
                        </Select>
                        </FormControl>       
                    </Box>
                </Box>
                <Box sx = {{display:'flex', flexDirection: landScape ? 'column' : 'row', alignItems: smallDisplay ? "center": "end", justifyContent:"center"}}>
                    <TextField sx={{width: '300px'}} 
                                    name = "price" 
                                    id="filled-basic" 
                                    label="Price"
                                    type = "number" 
                                    variant="filled"/>
                </Box>
                </Box>
                <Box mt = {landScape? 0:1} sx = {{display:'flex', flexDirection: "column", alignItems: "center", marginLeft:landScape ? 0 : 2}}>
                <FormLabel id="demo-radio-buttons-group-label">{landScape? '' : 'Direction'}</FormLabel>
                <RadioGroup sx={{display:'flex', flexDirection: smallDisplay ? 'column' : 'row'}}
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group">
                <FormControlLabel 
                        onClick={() => setDirection("after")} 
                        value="after" 
                        control={<Radio />} 
                        label="After" />
                <FormControlLabel 
                        onClick={() => setDirection("before")} 
                        value="before" 
                        control={<Radio />} 
                        label="Before" />
              </RadioGroup>
          </Box>
                
                <Box sx = {{display: 'flex', justifyContent: 'center'}}>
                                    <Button type="submit"
                                        variant="contained">Filter
                                    </Button>
                 </Box>
            </Box>
}

export default FilterComponent;