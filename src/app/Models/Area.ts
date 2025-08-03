export class Area {
    id?: number;
    description?: string;
    cityId?: number;


    constructor(data?: Partial<Area>) {
        if (data) {
          Object.assign(this, data);
        }
      }
}

