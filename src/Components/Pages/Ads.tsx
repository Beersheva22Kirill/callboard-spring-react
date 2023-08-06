import { Box, Button, Typography } from "@mui/material"
import AdvertsGrid from "../Grids/AdvertsGrid";
import { useState, useEffect } from "react";
import { Advert } from "../../Model/Advert";
import {callBoardService} from "../../Config/service-config";
import { Subscription } from "rxjs";
import { useDispatch } from "react-redux";
import { CodePayload } from "../../Model/Alert/CodePayload";
import CodeType from "../../Model/Alert/CodeType";
import { alertAction } from "../../Redux/Slice/AlertMessageSlice";
import FilterComponent from "../Filter/FilterComponent";
import { FilterType } from "../../Model/FilterType";

type Props = {

}

const Ads:React.FC<Props> = (props) => {
    const dispatch = useDispatch()
    const [adverts, setAdverts] = useState<Advert[]>([]);
    const [filtration,setFiltration] = useState<boolean>(false);
    const [filterObj,setFilterObj] = useState<FilterType>()

    useEffect(() => {
       let subscription: Subscription;
       if(!filterObj){
        subscription = callBoardService.getAdverts().subscribe({
            next(advertsArr:Advert[]|string){ 
                const codeAlert: CodePayload = {code:CodeType.OK,message:''}    
                if (typeof advertsArr !== 'string') {
                    setAdverts(advertsArr)
                } else {
                    codeAlert.code = CodeType.SERVER_ERROR;
                    codeAlert.message = advertsArr;
                }
                dispatch(alertAction.set(codeAlert))
            }
        })
       } else {
            if(filterObj.price){
                subscription = callBoardService.getByPrice(filterObj.price!,filterObj.direction == "before" ? true : false).subscribe({
                    next(advertsArr:Advert[]|string){ 
                        const codeAlert: CodePayload = {code:CodeType.OK,message:''}    
                        if (typeof advertsArr !== 'string') {
                            advertsArr = filterObj.category ? advertsArr.filter((advert) => advert.category == filterObj.category) : advertsArr;
                            setAdverts(advertsArr)
                        } else {
                            codeAlert.code = CodeType.SERVER_ERROR;
                            codeAlert.message = advertsArr;
                        }
                        dispatch(alertAction.set(codeAlert))
                    }
                })
            }else{
                subscription = callBoardService.getByCategory(filterObj.category!).subscribe({
                    next(advertsArr:Advert[]|string){ 
                        const codeAlert: CodePayload = {code:CodeType.OK,message:''}    
                        if (typeof advertsArr !== 'string') {
                            setAdverts(advertsArr)
                        } else {
                            codeAlert.code = CodeType.SERVER_ERROR;
                            codeAlert.message = advertsArr;
                        }
                        dispatch(alertAction.set(codeAlert))
                    }
                })
            }
        
       }
        
        return () => subscription.unsubscribe();
    },[filterObj])

const deleteHandler = async (id:any) => {
    const codeAlert: CodePayload = {code:CodeType.OK,message:''} 
    const res = await callBoardService.deleteProduct(id)
    if (typeof res !== 'string'){
        codeAlert.message = "Adverts with id: " + id + "deleted"
    } else{
        codeAlert.code = CodeType.SERVER_ERROR;
        codeAlert.message = res;
    } 
    dispatch(alertAction.set(codeAlert))
    
}

const handlerFilter = (filterObject:FilterType) => {
   setFilterObj(filterObject)   
}

const handlerReset = () => {
    setFilterObj(undefined)
}

    return <Box sx={{height:"70vh", overflowY:"auto"}}>
        <Box sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <Button onClick={handlerReset} sx={{marginLeft:2}} variant="contained">Reset filter</Button>
            <FilterComponent callBack={handlerFilter}></FilterComponent>
        </Box>
        
        <Box sx={{height:"50vh", overflowY:"auto", display:'flex',justifyContent:'center'}}>
            <AdvertsGrid callBackDelete={deleteHandler} adverts={adverts}></AdvertsGrid>
        </Box>
        
    </Box>
}

export default Ads;