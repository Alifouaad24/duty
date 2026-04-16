import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setItem(key: string, value: any, expired: number): void {

    var now = new Date().getDate();

    var item = {
      value: value,
      expired: now + expired
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  getWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
      this.remove(key);
      return null;
    }

    return item.value;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

}
