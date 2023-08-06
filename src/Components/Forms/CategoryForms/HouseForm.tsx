import { Box, Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Advert } from "../../../Model/Advert"
import { useSelectorMainPropertyes } from "../../../Redux/Store"
import CodeType from "../../../Model/Alert/CodeType";
import { alertAction } from "../../../Redux/Slice/AlertMessageSlice";
import { CodePayload } from "../../../Model/Alert/CodePayload";
import { useDispatch } from "react-redux";
import { HouseDatails } from "../../../Model/HouseDatails";
import { useMemo, useState } from "react";
import { TypeAdvert } from "../../../Model/TypeAdvert";
import {houseType} from "../../../Config/category-config"

type Props = {
    callBackAdd:(advert:Advert) => Promise<number|string>;
    callBackUpdate:(advert:Advert, id:any) => Promise<Advert|string> 
}

const HouseForm:React.FC<Props> =(props) =>{

    const theme = useTheme();
    const smallDisplay = useMediaQuery(theme.breakpoints.down('sm'));
    const landScape = useMediaQuery(theme.breakpoints.down('md'));
    

    const baseObject:Advert = useSelectorMainPropertyes()
    const dispatch = useDispatch();

    const baseDatails = useMemo<HouseDatails>(() => getDatails(), [baseObject]);
    const [typeAdvert, setTypeHouse] = useState<TypeAdvert>(baseDatails ? baseDatails.typeAdvert : "rent");
    const [typeHouseSel, setTypeHouseSel] = useState(baseDatails ? baseDatails.typeHouse : "");

    function getDatails(){
        let res; 
        if(baseObject.data){
            res = JSON.parse(baseObject.data)
        }
        return res;
    }

    const handleChange = (event: SelectChangeEvent) => {
        setTypeHouseSel(event.target.value);
    }

    const handlerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const codeAlert: CodePayload = {code:CodeType.OK,message:''}
        console.log(baseObject);
        const data = new FormData(event.currentTarget);
        
        const datails:HouseDatails = {
            countRooms: Number.parseInt(`${data.get('rooms')}`),
            square: Number.parseFloat(`${data.get('rooms')}`),
            tax:Number.parseFloat(`${data.get('tax')}`),
            typeAdvert:typeAdvert,
            typeHouse:typeHouseSel
    
        }
        const advert:Advert = JSON.parse(JSON.stringify(baseObject))
        advert.data = JSON.stringify(datails);
        const id = await props.callBackAdd(advert);
        if (typeof id !== 'string'){
            codeAlert.message = "Advert added id of advert: " + id
        } else{
            codeAlert.code = CodeType.SERVER_ERROR;
            codeAlert.message = id;
        } 
        dispatch(alertAction.set(codeAlert))
    }


    

    return <Box>
        <Box component={"form"} onSubmit={handlerSubmit}>
        
        <Box mt = {landScape? 0:1} sx = {{display:'flex', flexDirection: "column", alignItems: "center"}}>
                <FormLabel id="demo-radio-buttons-group-label">{landScape? '' : 'Type ads'}</FormLabel>
                <RadioGroup sx={{display:'flex', flexDirection: smallDisplay ? 'column' : 'row'}}
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={baseDatails ? baseDatails.typeHouse: 'rent'}
                        name="radio-buttons-group">
                <FormControlLabel 
                        onClick={() => setTypeHouse("rent")} 
                        value="rent" 
                        control={<Radio />} 
                        label="Rent" />
                <FormControlLabel 
                        onClick={() => setTypeHouse("sale")} 
                        value="sale" 
                        control={<Radio />} 
                        label="Sale" />
              </RadioGroup>
          </Box>

          <FormControl sx={{marginTop: 1, width:"300px", marginRight: 2}} fullWidth>
                                    <InputLabel  id="demo-simple-select-label">Category</InputLabel>
                                    <Select 
                                    name="category"
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Category"
                                    defaultValue={baseDatails ? baseDatails.typeHouse: ''}
                                    onChange={handleChange} required>
                                    {houseType.map((item:string) => <MenuItem value={item}>{item}</MenuItem>)}
                                    </Select>
                                    </FormControl>

           <TextField sx={{width: '300px', marginTop:1}} 
                                    name = "rooms" 
                                    id="filled-basic" 
                                    label="Rooms number" 
                                    variant="filled" required/>
                             
            <TextField inputProps={{}} 
                                    sx={{width: '300px', marginTop:1}} 
                                    name = "square"
                                    id="filled-basic" 
                                    label= "Square"  
                                    variant="filled" required/>
            <TextField inputProps={{}} 
                                    sx={{width: '300px', marginTop:1}} 
                                    name = "tax"
                                    id="filled-basic" 
                                    label= "Tax"  
                                    type = "number"
                                    variant="filled" required/>

            <Box  mt={2} sx = {{display: 'flex', justifyContent: 'center'}}>
                <Button type="submit"
                    variant="contained">Submit
                </Button>
            </Box>
        </Box> 

    </Box>
}

export default HouseForm;