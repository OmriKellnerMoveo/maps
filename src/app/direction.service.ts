import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DirectionService<T> {

  constructor() {
  }

  saveLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  loadLocalStorage(key: string): T {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  }
}
