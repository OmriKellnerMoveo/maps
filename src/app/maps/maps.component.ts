import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {MapsAPILoader} from "@agm/core";
import {Location} from "../location";
import {Directivelocation} from "../directivelocation";
import {DirectionService} from "../direction.service";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  travelMode: any;
  selectedSourceAndDirection:[boolean,boolean]=[false,false]
  public origin: any;
  public destination: any;
  distance: any;
  isSourceLocation: boolean = true;
  location: Location = {lat: 32.064582, lng: 34.7718053, address: 'Har Sinai St 1, Tel Aviv-Yafo, Israel'};
  sourceLocation:Location|any
  destinationLocation: Location|any
  zoom: number = 8;
  saveLocations:Directivelocation={saveLocations:[]}
  private geoCoder: any;

  @ViewChild('search')
  public searchElementRef: ElementRef | any;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private storage:DirectionService<string>
  ) { }

  ngOnInit() {
    // let temps:any= localStorage.getItem('saveLocation')
    let temps:any= this.storage.loadLocalStorage('saveLocation')
    temps?this.saveLocations.saveLocations = temps:this.saveLocations.saveLocations=[]
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.location.lat = place.geometry.location.lat();
          this.location.lng = place.geometry.location.lng();
          this.getAddress(this.location.lat, this.location.lng);
          this.zoom = 8;
        });
      });
    });
  }
  selectChangeHandler(event:any)
  {
    this.travelMode=[event.target.value]
  }
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
  onChoseLocation(event: any) {
    this.location.lat = event.coords.lat;
    this.location.lng = event.coords.lng;
    this.getAddress(this.location.lat, this.location.lng);
    // let Temp: Location = this.location;
    this.isSourceLocation ? this.sourceLocation = this.location : this.destinationLocation = this.location
  }

  markerDragEnd($event: MouseEvent | any) {
    this.location.lat = $event.coords.lat;
    this.location.lng = $event.coords.lng;
    this.getAddress(this.location.lat, this.location.lng);
    let Temp: Location = this.location;
    this.isSourceLocation ? this.sourceLocation = Temp : this.destinationLocation = Temp
  }

  getAddress(latitude:number, longitude:number) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.location.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  setSource() {
    this.isSourceLocation=!this.isSourceLocation
    this.origin = {lat: this.location.lat, lng: this.location.lng};
    this.getAddress(this.location.lat, this.location.lng);
    this.sourceLocation= {...this.location};
    this.selectedSourceAndDirection[0]=true;
    if (this.selectedSourceAndDirection[1]){
      this.selectedSourceAndDirection=[false,false]
      this.distance = this.calculateDistance(this.origin, this.destination)
       this.createLocationObject()
    }
  }

  setDestination() {
    this.isSourceLocation=!this.isSourceLocation
    this.destination = {lat: this.location.lat, lng: this.location.lng};
    this.getAddress(this.location.lat, this.location.lng);
    this.destinationLocation= {...this.location};
    this.selectedSourceAndDirection[1]=true;
    if (this.selectedSourceAndDirection[0]){
      this.selectedSourceAndDirection=[false,false]
      this.distance = this.calculateDistance(this.origin, this.destination)
       this.createLocationObject()
    }
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.lat = position.coords.latitude;
        this.location.lng = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.location.lat, this.location.lng);
        let Temp: Location = this.location;
        this.isSourceLocation ? this.sourceLocation = Temp : this.destinationLocation = Temp
      });
    }
  }
  createLocationObject(){
    if (this.saveLocations && this.saveLocations.saveLocations.length>5){
      this.saveLocations.saveLocations.splice(0,1)
    }

    this.saveLocations.saveLocations.push(
      {
        travelMode: this.travelMode?this.travelMode:"Driving",
        sourceLocation: this.sourceLocation?this.sourceLocation:'Error sourceLocation',
        destinationLocation: this.destinationLocation?this.destinationLocation:'Error destinationLocation',
        distance: this.distance?this.distance:'Error distance'
      }
    )
    this.storage.saveLocalStorage('saveLocation',this.saveLocations.saveLocations)
  }

  onSelectChange(event:any){
    let currentLocation = this.saveLocations.saveLocations[event.target.value]
   this.location={lat:currentLocation.sourceLocation.lat,lng:currentLocation.sourceLocation.lng,address:currentLocation.sourceLocation.address}
  }
}
