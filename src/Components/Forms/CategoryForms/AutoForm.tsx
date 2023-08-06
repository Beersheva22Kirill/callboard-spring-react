import { Box, Button, TextField, Typography } from "@mui/material"
import { Advert } from "../../../Model/Advert"
import { useSelectorMainPropertyes } from "../../../Redux/Store"
import { CodePayload } from "../../../Model/Alert/CodePayload";
import CodeType from "../../../Model/Alert/CodeType";
import { useDispatch } from "react-redux";
import { alertAction } from "../../../Redux/Slice/AlertMessageSlice";
import { AutoDatails } from "../../../Model/AutoDatails";
import { useEffect, useMemo, useState } from "react";

type Props = {
   callBackAdd:(advert:Advert) => Promise<number|string>; 
   callBackUpdate:(advert:Advert, id:any) => Promise<Advert|string> 
}



const AutoForm:React.FC<Props> = (props) =>{
    
    const baseObject:Advert = useSelectorMainPropertyes()
    const dispatch = useDispatch();

    const baseDatails = useMemo<AutoDatails>(() => getDatails(), [baseObject]);
    
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
    
    const datails:AutoDatails = {
        model: `${data.get('model')}`,
        color: `${data.get('color')}`,
        producer: `${data.get('producer')}`,
        year:Number.parseInt(`${data.get('year')}`),
        milage:Number.parseInt(`${data.get('milage')}`),
    }

    const advert:Advert = JSON.parse(JSON.stringify(baseObject))
    advert.data = JSON.stringify(datails);
    let res;

    if (baseObject.id) {
        res = await props.callBackUpdate(advert, baseObject.id);
    } else {
        res = await props.callBackAdd(advert);
    }
    if (typeof res !== 'string') {
        codeAlert.message = typeof res == 'number' ? "Advert added id of advert: " + res : "Advert id: " + res.id + " updated";
    } else {
        codeAlert.code = CodeType.SERVER_ERROR;
        codeAlert.message = res;
    }

    dispatch(alertAction.set(codeAlert))
}

  return <Box>
        <Box component={"form"} onSubmit={handlerSubmit}>
            <TextField  sx={{width: '300px'}} 
                                    name = "producer"
                                    id="filled-basic" 
                                    label= {`Producer`}  
                                    defaultValue={baseDatails ? baseDatails.producer : null}
                                    variant="filled" required/>

           <TextField  sx={{width: '300px', marginTop:1}} 
                                    name = "model" 
                                    id="filled-basic" 
                                    label="Model" 
                                    variant="filled" required
                                    defaultValue={baseDatails ? baseDatails.model : null}/>  

            <TextField  sx={{width: '300px', marginTop:1}} 
                                    name = "color"
                                    id="filled-basic" 
                                    label= {`color`}  
                                    defaultValue={baseDatails ? baseDatails.color : null}
                                    variant="filled" required/>

            <TextField inputProps={{}} 
                                    sx={{width: '300px', marginTop:1}} 
                                    name = "year"
                                    id="filled-basic" 
                                    label= {`Year`}
                                    type="number"  
                                    defaultValue={baseDatails ? baseDatails.year : null}
                                    variant="filled" required/>
            <TextField inputProps={{}} 
                                    sx={{width: '300px', marginTop:1}} 
                                    name = "milage"
                                    id="filled-basic" 
                                    label= {`Milage`} 
                                    type="number" 
                                    defaultValue={baseDatails ? baseDatails.milage : null}
                                    variant="filled" required/>

            <Box mt={2} sx = {{display: 'flex', justifyContent: 'center'}}>
                <Button type="submit"
                    variant="contained">Submit
                </Button>
            </Box>
        </Box> 
    </Box>
}

export default AutoForm;

