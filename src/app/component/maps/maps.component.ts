import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {MapsAPILoader} from "@agm/core";
import {Location} from "../../interface/location";
import {DirectiveLocation} from "../../interface/directiveLocation";
import {LocalStorage} from "../../service/local-storage";
import {MapService} from "../../service/map.service";

@Component({
  selector: 'app-maps', templateUrl: './maps.component.html', styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  travelMode: any;
  selectedSourceAndDirection: [boolean, boolean] = [false, false]
  origin: { lat: number, lng: number } = {lat: 0, lng: 0};
  destination: { lat: number, lng: number } = {lat: 0, lng: 0};
  distance: any;
  isSourceLocation: boolean = true;
  location: Location = {lat: 32.064582, lng: 34.7718053, address: 'Har Sinai St 1, Tel Aviv-Yafo, Israel'};
  sourceLocation: Location = {lat: 0, lng: 0, address: ''};
  destinationLocation: Location = {lat: 0, lng: 0, address: ''}
  zoom: number = 8;
  saveLocations: DirectiveLocation = {saveLocations: []}
  @ViewChild('search') searchElementRef: ElementRef | any;
  private geoCoder: any;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private storage: LocalStorage<string>, private mapService: MapService) {
  }

  ngOnInit() {
    this.initSaveLocations()
    this.initMapsApi()
  }

  initMapsApi() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          const {geometry} = place
          if (geometry === undefined || geometry === null) {
            return;
          }
          const {lat, lng} = geometry.location
          this.updateLocation(lat(),lng(),this.mapService.getAddress(this.location.lat, this.location.lng, this.geoCoder))
          this.zoom = 8;
        });
      });
    });
  }

  initSaveLocations() {
    let temps: any = this.storage.loadLocalStorage('saveLocation')
    temps ? this.saveLocations.saveLocations = temps : this.saveLocations.saveLocations = []
  }

  selectChangeHandler(event: any) {
    event.target.value ? this.travelMode = event.target.value : this.travelMode = 'Drive'
  }

  onChoseLocation(event: any) {
    this.updateLocation(event.coords.lat,event.coords.lng,this.mapService.getAddress(this.location.lat, this.location.lng, this.geoCoder))
    this.zoom = 12
    this.isSourceLocation ? this.sourceLocation = this.location : this.destinationLocation = this.location
  }

  setLocation(type: string) {
    this.isSourceLocation = !this.isSourceLocation
    this.location.address = this.mapService.getAddress(this.location.lat, this.location.lng, this.geoCoder)
    let tempLocation = {lat: this.location.lat, lng: this.location.lng};
    if (type === 'source') {
      this.destination = tempLocation;
      this.destinationLocation = {...this.location};
      this.selectedSourceAndDirection[1] = true;
    } else {
      this.origin = tempLocation
      this.sourceLocation = {...this.location};
      this.selectedSourceAndDirection[0] = true;
    }
    if (this.selectedSourceAndDirection[0] && this.selectedSourceAndDirection[1]) {
      this.selectedSourceAndDirection = [false, false]
      this.distance = this.mapService.calculateDistance(this.origin, this.destination)
      this.mapService.createLocationObject(this.saveLocations, this.travelMode, this.sourceLocation, this.destinationLocation, this.distance)
    }
  }

  onSelectChange(event: any) {
    const {lat, lng, address} = this.saveLocations.saveLocations[event.target.value].sourceLocation
    this.updateLocation(lat, lng, address)
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords
        this.updateLocation(latitude,longitude,this.mapService.getAddress(this.location.lat, this.location.lng, this.geoCoder))
        this.zoom = 8;
        this.isSourceLocation ? this.sourceLocation = this.location : this.destinationLocation = this.location
      });
    }
  }
  updateLocation(lat: number, lng: number,address:string)
  {
    this.location = {
      lat: lat, lng: lng, address: address
    }
  }
}
