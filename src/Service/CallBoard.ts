import { Observable } from "rxjs";
import { Advert } from "../Model/Advert";

export default interface CallBoard {

    addAdvert(advert:Advert):Promise<number|string>;
    getAdverts():Observable<Advert[]|string>;
    getAdvertById(id:any):Promise<Advert|String>;
    getByCategory(category:string):Observable<Advert[]|string>;
    getByPrice(price:number,before:boolean):Observable<Advert[]|string>;
    updateAdvert(advert:Advert, id:any):Promise<Advert|string>;
    deleteProduct(id:any):Promise<void|string>;
    

}