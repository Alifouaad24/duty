export class Receipt {
    cost?: number;
    currency?: string;
    currentState?: boolean;
    customer: any; 
    customerId?: number;
    disCount?: number;
    insertBy?: string;
    insertDate?: string; 
    isFinanced?: boolean;
    notes?: string;
    recieptDate?: string;
    recieptId?: number;
    sellingCurrency?: string;
    sellingDisCount?: number;
    sellingPrice?: number;
    totalPriceFromCust?: number;
    weight?: number;
    shippingBatch?: any;
    shippingBatchId?: number
    costIQ?: number
    sellingUSD?: number
    constructor(data?: Partial<Receipt>) {
      if (data) {
        Object.assign(this, data);
      }
    }
  }
  