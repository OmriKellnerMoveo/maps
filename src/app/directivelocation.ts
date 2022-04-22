import {Location} from "./location";

export interface Directivelocation {
  saveLocations: Array<{
    travelMode:string,
    sourceLocation:Location,
    destinationLocation:Location,
    distance:any
  }>
}
