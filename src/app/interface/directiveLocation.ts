import {Location} from "./location";

export interface DirectiveLocation {
  saveLocations: Array<{
    travelMode:string,
    sourceLocation:Location,
    destinationLocation:Location,
    distance:any
  }>
}
