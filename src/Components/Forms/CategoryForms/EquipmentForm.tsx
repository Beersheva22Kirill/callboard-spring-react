import { Box, Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import AutoForm from "./AutoForm";
import { Advert } from "../../../Model/Advert";
import { CodePayload } from "../../../Model/Alert/CodePayload";
import CodeType from "../../../Model/Alert/CodeType";
import { useSelectorMainPropertyes } from "../../../Redux/Store";
import { useDispatch } from "react-redux";
import { alertAction } from "../../../Redux/Slice/AlertMessageSlice";
import { EquipmentDatail } from "../../../Model/EquipmentDatail";
import {equipmentType} from "../../../Config/category-config"
import { useMemo, useState } from "react";
import { StateEquipment } from "../../../Model/StateEquipment";

type Props = {
    callBackAdd:(advert:Advert) => Promise<number|string>;
    callBackUpdate:(advert:Advert, id:any) => Promise<Advert|string> 
}


const EquipmentForm:React.FC<Props> =(props) =>{

    const theme = useTheme();
    const smallDisplay = useMediaQuery(theme.breakpoints.down('sm'));
    const landScape = useMediaQuery(theme.breakpoints.down('md'));

    const baseObject:Advert = useSelectorMainPropertyes()
    const dispatch = useDispatch();
    const baseDatails = useMemo<EquipmentDatail>(() => getDatails(), [baseObject]);

    const [typeEquipment, setTypeEquipment] = useState<string>(baseDatails ? baseDatails.type : "");
    const [stateEquipment, setStateEquipment] = useState<StateEquipment>(baseDatails ? baseDatails.state : 'new');

    function getDatails(){
        let res; 
        if(baseObject.data){
            res = JSON.parse(baseObject.data)
        }
        return res;
    }
    
    const handlerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const codeAlert: CodePayload = {code:CodeType.OK,message:''}
        const data = new FormData(event.currentTarget);
        
        const datails:EquipmentDatail = {
            state: stateEquipment,
            type: typeEquipment
    
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

    const handleChange = (event: SelectChangeEvent) => {
        setTypeEquipment(event.target.value);
    }



    return <Box component={"form"} onSubmit={handlerSubmit}>
                 <Box mt = {landScape? 0:1} sx = {{display:'flex', flexDirection: "column", alignItems: "center"}}>
                        <FormLabel id="demo-radio-buttons-group-label">{landScape? '' : 'State'}</FormLabel>
                            <RadioGroup sx={{display:'flex', flexDirection: smallDisplay ? 'column' : 'row'}}
                                   aria-labelledby="demo-radio-buttons-group-label"
                                   defaultValue={baseDatails ? baseDatails.state: "new"}
                                   name="radio-buttons-group">
                            <FormControlLabel 
                                onClick={() => setStateEquipment("new")} 
                                value="new" 
                                control={<Radio />} 
                                label="New" />
                            <FormControlLabel 
                                onClick={() => setStateEquipment("used")} 
                                value="used" 
                                control={<Radio />} 
                                label="Used" />
                        </RadioGroup>
                </Box>

                    <FormControl sx={{marginTop: 1, width:"300px", marginRight: 2}} fullWidth>
                                <InputLabel  id="demo-simple-select-label">Category</InputLabel>
                                <Select 
                                name="category"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Category"
                                defaultValue={baseDatails ? baseDatails.type: ''}
                                onChange={handleChange} required>
                                {equipmentType.map((item:string) => <MenuItem value={item}>{item}</MenuItem>)}
                                </Select>
                    </FormControl>

    <Box mt={2} sx = {{display: 'flex', justifyContent: 'center'}}>
            <Button type="submit"
                variant="contained">Submit
            </Button>
    </Box>
</Box>
}

export default EquipmentForm;