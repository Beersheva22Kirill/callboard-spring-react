import './App.css';
import { Alert, Box, Snackbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import congigMenu from "./Config/navConfig.json"
import NavigatorDispather from './Components/Navigators/NavigatorDispather';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Ads from './Components/Pages/Ads';
import Service from './Components/Pages/AddAds';
import { StatusType } from './Model/Alert/StatusType';
import { useDispatch } from 'react-redux';
import { CodePayload } from './Model/Alert/CodePayload';
import CodeType from './Model/Alert/CodeType';
import { alertAction } from './Redux/Slice/AlertMessageSlice';
import { useMemo } from 'react';
import { useSelectorAlertState } from './Redux/Store';
import AddAds from './Components/Pages/AddAds';


function App() {

  const theme = useTheme();
  const smallDisplay = useMediaQuery(theme.breakpoints.down('sm'));
  const landScape = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch()
  const codeMessage:CodePayload = useSelectorAlertState(); 
  const [alertMessage, severity] = useMemo(() => codeProcessing(), [codeMessage]);


  function codeProcessing() {
    const res:[string,StatusType] = ['','success']
    res[1] = codeMessage.code  === CodeType.OK ? 'success' : 'error'
    res[0] = codeMessage.message

    return res
  }

  return (
    <Box>
    <Typography variant = {smallDisplay ? 'h5': 'h3'} >CallBoard application</Typography>
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<NavigatorDispather navItem={congigMenu.items}></NavigatorDispather>}>
          <Route path='/Ads' element = {<Ads></Ads>}></Route>
          <Route path='/AddAds' element = {<AddAds></AddAds>}></Route>   
      </Route>
    </Routes>
    </BrowserRouter>
    <Snackbar open={!!alertMessage} autoHideDuration={20000}
                     onClose={() => dispatch(alertAction.reset())}>
                        <Alert  onClose = {() => dispatch(alertAction.reset())} severity={severity} sx={{ width: '100%' }}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
  </Box>
  );
}

export default App;


