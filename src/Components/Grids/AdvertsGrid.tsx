import { Box, createTheme, useMediaQuery, useTheme } from "@mui/material"
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowParams } from "@mui/x-data-grid"
import { ReactNode, useState } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModalWindow from "../Common/ModalWindow"
import { Advert } from "../../Model/Advert"
import Confirmation from "../Common/Confirmation";
import MainForm from "../Forms/MaintForm";
import ViewForm from "../Forms/ViewForm";

type Props = {
    adverts: Advert[],
    callBackDelete:(id:any) => void;
   
}

const AdvertsGrid:React.FC<Props> = (props) => {

    const theme = useTheme();
    const smallDisplay = useMediaQuery(theme.breakpoints.down('sm'));
    const landScape = useMediaQuery(theme.breakpoints.down('md'));

    const [activeForm, setActiveForm] = useState<boolean>(false)
    const [activeConfirm, setActiveConfirm] = useState<boolean>(false)
    const [editForm, setEditForm] = useState<ReactNode>()

    const [activeView, setActiveView] = useState<boolean>(false)
    const [viewForm, setViewForm] = useState<ReactNode>()

    const [title, setTitle] = useState<string>('')
    const [content,setContent] = useState<string>('')
    const [id,setId] = useState<any>()

    const columns: GridColDef[] =  
    [
        { field: 'id', headerName: 'ID', flex: 0.1 , headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'category', headerName: 'Category', flex: 0.4 , headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'name', headerName: 'Name',flex: 0.4, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center'},
        { field: 'price', headerName: 'Price',flex: 0.4, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center'},
        {
            field: 'actions',headerName: 'Menu', type: 'actions',flex:0.2,
            getActions: (params:GridRowParams) => [
                <GridActionsCellItem onClick={() => openViewForm(params.id)} icon={<VisibilityIcon/>} label="View" showInMenu = {landScape ? true : false}/>,
                <GridActionsCellItem onClick={() => openEditForm(params.id)} icon={<EditIcon/>} label="Edit" showInMenu = {landScape ? true : false}/>,
                <GridActionsCellItem onClick={() => openConfirm(params.id)} icon={<DeleteIcon/>} label="Delete" showInMenu = {landScape ? true : false}/> 
            ]
        }
    ] 


    const openViewForm = (id:GridRowId) => {
        const index = props.adverts.findIndex((advert) => advert.id == id)
        setViewForm(<ViewForm advert={props.adverts[index]}></ViewForm>)
        setActiveView(true);
    }

    const openEditForm = (id:GridRowId) => {
        const index = props.adverts.findIndex((advert) => advert.id == id)
        setEditForm(<MainForm advert={props.adverts[index]}></MainForm>)
        setActiveForm(true);
    }

    const openConfirm = (id:GridRowId) => {
        const index = props.adverts.findIndex((advert) => advert.id == id)
        setTitle(`You confirm remove of advert: ${props.adverts[index].name} with id: ${props.adverts[index].id}`)
        setContent('Recovering is not possible after removing advert')
        setActiveConfirm(true) 
        setId(id)
    }

    const deleteAdvert = () => {
        props.callBackDelete(id)
    }


   
    return <Box sx ={{width:'90%',display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Confirmation active = {activeConfirm} callbackAgree={deleteAdvert} content={content} question={title} setActive={setActiveConfirm}></Confirmation>
                <ModalWindow active = {activeForm} element = {editForm} setActive={setActiveForm}></ModalWindow>
                <ModalWindow active = {activeView} element = {viewForm} setActive={setActiveView}></ModalWindow>
                <DataGrid 
                    rows={props.adverts}
                    columns={columns}/>
            </Box>
}

export default AdvertsGrid;