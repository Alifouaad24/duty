export class Offer {
    merchant: string;
    price: number;
    link: string
  
    constructor(merchant: string, price: number, link: string) {
      this.merchant = merchant;
      this.price = price;
      this.link = link
    }
  
    static fromJson(json: any): Offer {
      return new Offer(
        json.merchant || "غير معروف", 
        json.price || 0 ,
        json.link || 'غي معروف'
      );
    }
  }
  