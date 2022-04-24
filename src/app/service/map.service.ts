import { Injectable } from '@angular/core';
import {DirectiveLocation} from "../interface/directiveLocation";
import {LocalStorage} from "./local-storage";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  address:string='No results found'
  constructor(private storage: LocalStorage<string>) { }
  calculateDistance(point1:any, point2:any) {
    const p1 = new google.maps.LatLng(
      point1.lat,
      point1.lng
    );
    const p2 = new google.maps.LatLng(
      point2.lat,
      point2.lng
    );
    return (
      google.maps.geometry.spherical.computeDistanceBetween(p1, p2)/1000
    ).toFixed(2);
  }


  getAddress(latitude:number, longitude:number ,geoCoder:any):string {
    geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.address =results[0].formatted_address
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
        this.address ='No results found'
      }
    });
    return this.address
  }


  createLocationObject(saveLocations:DirectiveLocation,travelMode:string,sourceLocation:any,destinationLocation:any,distance:number):DirectiveLocation {
    if (saveLocations && saveLocations.saveLocations.length > 5) {
      saveLocations.saveLocations.splice(0, 1)
    }
    saveLocations.saveLocations.push({
      travelMode: travelMode ? travelMode : "Driving",
      sourceLocation: sourceLocation ? sourceLocation : 'Error sourceLocation',
      destinationLocation: destinationLocation ? destinationLocation : 'Error destinationLocation',
      distance: distance ? distance : 'Error distance'
    })
    this.storage.saveLocalStorage('saveLocation', saveLocations.saveLocations)
  return saveLocations
  }
}
