import { Box, Button, Container, CssBaseline, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography, useMediaQuery, useTheme} from "@mui/material";
import React, { useState, ReactNode } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {categoryesMap} from "../../Config/category-config"
import { Advert } from "../../Model/Advert";
import { useDispatch } from "react-redux";
import { propertyesAction } from "../../Redux/Slice/MainPropertySlice";

type Props = {
    advert?:Advert;   
}

const MainForm:React.FC<Props> = (props) => {

    const theme = useTheme();
    const smallDisplay = useMediaQuery(theme.breakpoints.down('sm'));
    const landScape = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch()
    const defaultTheme = createTheme();
    const [datailForm, setDatailForm] = useState<ReactNode>();
    const [currrentCategory, setCurrentCategory] = useState(props.advert ? props.advert.category : "")
    const [disabledMain, setDisabledMain] = useState<boolean>(false)

    let categoryes:any[] = [];
    categoryesMap.forEach((__,key) => {
         categoryes.push(<MenuItem value={key}>{key}</MenuItem>)
    })
      
  const handlerChCategory = (event: SelectChangeEvent) => {
     setCurrentCategory(event.target.value)
  }

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const baseObject:Advert = {
        category:currrentCategory,
        name:`${data.get("name")}`,
        price:Number.parseFloat(`${data.get('price')}`),
    }
    
    if(props.advert){
        baseObject.id = props.advert.id
        baseObject.data = props.advert.data
    }

    dispatch(propertyesAction.set(baseObject))
    setDisabledMain(true);
    setDatailForm(categoryesMap.get(currrentCategory));
    
      
  }

  const handlerReset = () => {
    setDisabledMain(false);
    setDatailForm(<Box></Box>)
  }
      

    return  <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                        display: 'flex',
                        flexDirection: smallDisplay ? "column" : "row",
                        alignItems: 'center',
                        justifyContent:'center'}}>
                   
                        <Box component="form" onSubmit={handlerSubmit} onReset={handlerReset}>
                             <Box> 
                             <Box>
                             <TextField sx={{width: '300px',marginTop:2}} 
                                    name = "name" 
                                    id="filled-basic" 
                                    label="Name" 
                                    variant="filled" 
                                    defaultValue = {props.advert ? props.advert.name : null}
                                    disabled = {disabledMain} required/>

                                    
                            <TextField inputProps={{}} 
                                    sx={{width: '300px', marginTop:1}} 
                                    name = "price"
                                    id="filled-basic" 
                                    label= {`price`} 
                                    type = 'number' 
                                    variant="filled"
                                    defaultValue = {props.advert ? props.advert.price : null} 
                                    disabled = {disabledMain} required/>
                                </Box> 
                                <Box mt={1}>
                                    <FormControl disabled = {disabledMain} sx={{marginTop: 1, width:"300px", marginRight: 2}} fullWidth>
                                    <InputLabel  id="demo-simple-select-label">Category</InputLabel>
                                    <Select onChange={handlerChCategory}
                                    name="category"
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Category"
                                    defaultValue = {props.advert ? props.advert.category : ""}
                                    required>
                                    {categoryes}
                                    </Select>
                                    </FormControl>       
                                </Box>   
                               <Box mt={2} sx = {{display:"flex", flexDirection:"row"}}>
                               <Box sx = {{marginRight: 3}}>
                                    <Button type="reset"
                                    variant="contained" >Reset
                                    </Button>
                                </Box>
                               <Box >
                                    <Button type="submit"
                                    variant="contained" disabled = {disabledMain}>Open datails
                                    </Button>
                                </Box>
                                
                                </Box>               
                                
                            </Box> 
    
                        </Box>
                        {datailForm} 
                </Box> 
            </Container>
        </ThemeProvider>
               
                     
                    
    
            
                   
}

export default MainForm;