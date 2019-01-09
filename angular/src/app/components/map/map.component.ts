import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { Entry } from '../../models/entry';

import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { EntryService } from "../../services/entry.service";

import { JsonObject } from '../../models/json';
import { Router } from '@angular/router';
import { ProfileImg } from '../../models/profile_picture';
import { HttpParams, HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None


})
export class MapComponent implements OnInit {
  public profile: Profile;
  public profiles: Profile[];
  public user: User[];
  public entries: Entry[];

  lat: number;
  lng: number;

  public profile_picture: ProfileImg[];
  id = localStorage.getItem("uuid");

  profile_id: string;
  datepipe: DatePipe = new DatePipe('en-US');

  bool: Boolean;
  location = {};



  @ViewChild('navTemplate', { read: TemplateRef }) navTemplate: TemplateRef<any>;


  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient


  ) { }

  ngOnInit() {

    if (localStorage.access_token) {
      console.log(this.id)

      this.bool = true;
      this.getUser();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
      };

      this.getProfile();
      this.getAllProfiles();


    }
    else {
      this.router.navigate(["login"]);
    }
  }


  refreshPage(): void {
    window.location.reload();
  }

  setPosition(position) {
    this.location = position.coords;
    this.lng = this.location["longitude"]
    this.lat = this.location["latitude"]



    //this.setGeoProfile(this.lat, this.lng)
  }

  public async getUser(): Promise<void> {
    try {
      const res = await this.userService.getUser<JsonObject>(this.id);
      this.user = res.data;
      console.log(this.user);
    } catch (error) {
      console.error(error);
    }
  }

  calcDistance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }


  public async getProfile(): Promise<void> {

    let params = new HttpParams();
    params = params.append('filter[uid.id]', this.id);

    try {

      await this.http.get<JsonObject>('http://localhost:8888/jsonapi/profile/user', { params: params })
        .subscribe(event => {
          this.profile = event.data;
          this.profile_id = event.data[0]["attributes"]["drupal_internal__profile_id"];



        });

    } catch (error) {
      console.error(error);
    }
  }


  public async getAllProfiles(): Promise<void> {

    try {

      await this.http.get<JsonObject>('http://localhost:8888/jsonapi/profile/user')
        .subscribe(event => {

          this.profiles = event.data;
          for (let i = 0; i < event.data.length; i++) {

            let uid = event.data[i]["relationships"]["uid"]["data"]["id"];
            let id = event.data[i]["id"];

            this.http.get<JsonObject>(`http://localhost:8888/jsonapi/user/user/${uid}`)
              .subscribe(event => {

                this.profiles[i].username = event.data["attributes"]["name"]

              })

            this.http.get<JsonObject>(`http://localhost:8888/jsonapi/profile/user/${id}/field_profile_picture`)
              .subscribe(event => {
                this.profiles[i].profile_img = event.data
                console.log(event.data);

              })

            this.profiles[i].attributes.distance = Number(this.calcDistance(this.lat, this.lng, this.profiles[i].attributes.field_lat, this.profiles[i].attributes.field_lng, "K").toFixed(1))
          }
        });


    } catch (error) {
      console.error(error);
    }
  }

  public async setGeoProfile(lat, lng) {


    try {

      const httpOptionsPatch = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("access_token")
        })
      };
      let body: any =
      {
        type: "user",
        field_lat: [
          {
            value: lat
          }
        ],
        field_lng: [
          {
            value: lng
          }
        ]
      }


      this.http.patch(`http://localhost:8888/profile/${this.profile_id}?_format=json`, body, httpOptionsPatch)
        .subscribe(event => {
          console.log(event);
          this.refresh_token();
        })

    } catch (error) {
      console.error("error");
    }
  }

  private refresh_token(): Promise<boolean> {
    let formData = new FormData();

    const data = {
      grant_type: "refresh_token",
      refresh_token: localStorage.getItem("refresh_token"),
      client_id: "33a7b468-55ea-4e65-99c5-09bc8ea061e9",
      client_secret: "root",
    };
    for (let key in data) {
      formData.append(key, data[key]);
    }
    let refresh = this.userService.new_access_token(formData).then(res => {

      let access_token = res.data["access_token"]
      let refresh_token = res.data["refresh_token"]

      localStorage.setItem("access_token", "Bearer " + access_token);
      localStorage.setItem("refresh_token", refresh_token);

      return true
    });
    return refresh
  }

  public labelOptions: any = {
    url: '../../../assets/svg/bed.svg',
    scaledSize: {
      width: 40,
      height: 60
    }
  }

}
