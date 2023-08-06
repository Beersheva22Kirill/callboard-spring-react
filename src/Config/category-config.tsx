import { ReactNode } from "react";
import AutoForm from "../Components/Forms/CategoryForms/AutoForm";
import HouseForm from "../Components/Forms/CategoryForms/HouseForm";
import EquipmentForm from "../Components/Forms/CategoryForms/EquipmentForm";
import {callBoardService} from "../Config/service-config"


export const houseType = ["Family","Flat","Cotteg"]
export const equipmentType = ["Refrigerator","TV","Computer","Smartphone","Drone","Amplifier"]

export const categoryesMap: Map<string,ReactNode> = new Map([
  ["Auto",<AutoForm callBackAdd={callBoardService.addAdvert.bind(callBoardService)} 
                    callBackUpdate={callBoardService.updateAdvert.bind(callBoardService)}/>],
  ["House",<HouseForm callBackAdd={callBoardService.addAdvert.bind(callBoardService)}
                      callBackUpdate={callBoardService.updateAdvert.bind(callBoardService)}/>],
  ["Equipments",<EquipmentForm callBackAdd={callBoardService.addAdvert.bind(callBoardService)}
                                  callBackUpdate={callBoardService.updateAdvert.bind(callBoardService)}/>]
])