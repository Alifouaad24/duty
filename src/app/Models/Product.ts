import { Offer } from "./Offer";

export class Product {
  
  asin: string;
  brand: string;
  category: string;
  color: string;
  currency: string;
  description: string;
  dimension: string;
  ean: string;
  elid: string;
  highest_recorded_price: number;
  images: string[];
  lowest_recorded_price: number;
  model: string;
  offers: Offer [];
  size: string;
  title: string;
  upc: string;
  weight: string;

  constructor(data?: Partial<Product>) {
    this.asin = data?.asin ?? '';
    this.brand = data?.brand ?? 'غير متوفر';
    this.category = data?.category ?? 'غير متوفر';
    this.color = data?.color ?? 'غير متوفر';
    this.currency = data?.currency ?? '';
    this.description = data?.description ?? 'غير متوفر';
    this.dimension = data?.dimension ?? '';
    this.ean = data?.ean ?? '';
    this.elid = data?.elid ?? '';
    this.highest_recorded_price = data?.highest_recorded_price ?? 0;
    this.images = data?.images ?? [];
    this.lowest_recorded_price = data?.lowest_recorded_price ?? 0;
    this.model = data?.model ?? 'غير متوفر';
    this.offers = data?.offers ?? [];
    this.size = data?.size ?? '';
    this.title = data?.title ?? 'غير متوفر';
    this.upc = data?.upc ?? '';
    this.weight = data?.weight ?? '';
  }

  static fromJson(json: any): Product {
    return new Product({
      asin: json.asin,
      brand: json.brand,
      category: json.category,
      color: json.color,
      currency: json.currency,
      description: json.description,
      dimension: json.dimension,
      ean: json.ean,
      elid: json.elid,
      highest_recorded_price: json.highest_recorded_price,
      images: json.images,
      lowest_recorded_price: json.lowest_recorded_price,
      model: json.model,
      offers: json.offers,
      size: json.size,
      title: json.title,
      upc: json.upc,
      weight: json.weight
    });
  }
}
