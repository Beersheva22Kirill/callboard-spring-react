import { Observable } from "rxjs";
import { Advert } from "../Model/Advert";
import CallBoard from "./CallBoard";
import { log } from "console";

const SERVER_NOT_AVALIABLE = 'Server is unavalible, repeat later';
const POLLER_INTERVAL = 1000;

class Cache {

    cacheStr:string = '';

    set(adverts:Advert[]):void{
        this.cacheStr = JSON.stringify(adverts);
    }

    reset():void{
        this.cacheStr = '';
    }

    isEqual(advert:Advert[]):boolean{

        return this.cacheStr === JSON.stringify(advert);
    }

    getChache():Advert[]{

        return !this.isEmpty() ? JSON.parse(this.cacheStr) : []
    }

    isEmpty(): boolean {
        return this.cacheStr.length === 0
    }
}

export default class CallBoardServiceRest implements CallBoard {

    private observable: Observable<Advert[]|string> | null = null;
    private cache: Cache = new Cache();

    constructor(private URL:string) {

    }


    getByCategory(category: string): Observable<string | Advert[]> {
        this.observable = new Observable<Advert[]|string>((subscriber) => {
            this.cache.reset()
            const intervalId = setInterval(()=>{
                this.getAdvertByCategory(category)
                .then(response => response.json())
                .then(data => {                  
                    if(!this.cache.isEqual(data)){
                        subscriber.next(data);
                        this.cache.set(data)
                    }
                })
                .catch(error => subscriber.next(SERVER_NOT_AVALIABLE));
            },POLLER_INTERVAL)
        return () => clearInterval(intervalId)   
        })   
        return this.observable
    }

     private async getAdvertByCategory(category:String){    
            const response = await fetch(this.URL + `/category/${category}`, {
                method: 'GET',
            });
            return response;
    }

    getByPrice(price: number, before: boolean): Observable<string | Advert[]> {
        this.observable = new Observable<Advert[]|string>((subscriber) => {
            this.cache.reset()
            const intervalId = setInterval(()=>{
                this.getAdvertByPrice(price,before)
                .then(response => response.json())
                .then(data => {                  
                    if(!this.cache.isEqual(data)){
                        subscriber.next(data);
                        this.cache.set(data)
                    }
                })
                .catch(error => subscriber.next(SERVER_NOT_AVALIABLE));
            },POLLER_INTERVAL)
        return () => clearInterval(intervalId)   
        })   
        return this.observable
    }

    private async getAdvertByPrice(price:number, before:boolean){    
        const response = await fetch(this.URL + `/price?price=${price}&before=${before}`, {
            method: 'GET',
        });
        return response;
}
   

    async addAdvert(advert: Advert): Promise<number|string> {
        try {
            const response = await fetch(this.URL,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'},
                body: JSON.stringify(advert)
            }) 
            return response.json();
        } catch (error) {
           return SERVER_NOT_AVALIABLE
        }
    }

    getAdverts(): Observable<string | Advert[]> {
        this.observable = new Observable<Advert[]|string>((subscriber) => {
            this.cache.reset()
            const intervalId = setInterval(()=>{
                this.getAllAdverts()
                .then(response => response.json())
                .then(data => {                  
                    if(!this.cache.isEqual(data)){
                        subscriber.next(data);
                        this.cache.set(data)
                    }
                })
                .catch(error => subscriber.next(SERVER_NOT_AVALIABLE));
            },POLLER_INTERVAL)
        return () => clearInterval(intervalId)   
        })

        return this.observable
    }

    private getAllAdverts() {

        return fetch(this.URL);
    }

    async getAdvertById(id: any): Promise<Advert|String> {
        try {
            const response = await fetch(this.URL + `/${id}`, {
                method: 'GET',
            });
            return await response.json();
        } catch (error) {
            return SERVER_NOT_AVALIABLE
        }
    }

    async updateAdvert(advert: Advert, id: any): Promise<string | Advert> {
        try {
            const response = await fetch(this.URL + `/${id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'},
                body: JSON.stringify(advert)
            }) 
            return response.json();
        } catch (error) {
           return SERVER_NOT_AVALIABLE
        }
    }
    
    async deleteProduct(id: any): Promise<string | void> {
        const response = await fetch(this.URL + `/${id}`,{
            method:"DELETE"
        })
        
        return response.json();
    }


    private async getResponse(response: Response) {
        let res;
        if (!response.ok) {
            res = response.status == 401 || response.status == 403 ? `Authentification error` : response.statusText;
        } else {
            res = await response.json();
        }
        return res;
    }

}