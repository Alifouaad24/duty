export class City {
    id?: number;
    description?: string;

    constructor(data?: Partial<City>){
        if(data){
            Object.assign(this, data);
        }
    }
}