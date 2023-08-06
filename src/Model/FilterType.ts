import { FilterDirection } from "./FilterDirection"

export type FilterType = {
    category?:string,
    price?:number,
    direction?:FilterDirection
}