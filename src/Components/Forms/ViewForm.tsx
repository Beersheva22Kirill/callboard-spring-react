import { Box, Typography } from "@mui/material";
import { Advert } from "../../Model/Advert"
import { useEffect, useMemo } from "react";

type Props ={
    advert:Advert;
}

const ViewForm:React.FC<Props> = (props) => {

    const arrayProperty = useMemo(() => getProperty(),[props.advert])

    function getProperty(): any {
        const res = [];
         const advertData = JSON.parse(props.advert.data!); 
         const tempAdvert:Advert = {
            id:props.advert.id,
            category:props.advert.category,
            name:props.advert.name,
            price:props.advert.price,
         }

         for (const key in tempAdvert){
             res.push(<Box>
                <Typography>{`${key}: ${tempAdvert[key as keyof Advert]}`}</Typography>
                </Box>)   
         }
        
         for(const key in advertData){
            res.push(<Box>
                <Typography>{`${key}: ${advertData[key]}`}</Typography>
                </Box>)  
         }
         return res
         
    }

    return <Box>
        <Box>
            {arrayProperty}
        </Box>
        
    </Box>
}

export default ViewForm;


