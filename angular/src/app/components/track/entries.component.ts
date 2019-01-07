import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { Entry } from '../../models/entry';

import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { EntryService } from "../../services/entry.service";

import { JsonObject } from '../../models/json';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileImg, ImgAttributes } from '../../models/profile_picture';
import { LocalstorageService } from "../../services/localstorage.service";
import { HttpParams, HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],

  
})
export class EntryComponent implements OnInit {
  public profile: Profile;
  public user: User[];
  public entries: Entry[];


  public profile_picture: ProfileImg[];
  id = localStorage.getItem("uuid");

  profile_id: string;

  private sub: any;

  @ViewChild('navTemplate', {read: TemplateRef}) navTemplate: TemplateRef<any>;

  constructor(
    private profileService: ProfileService,
    private userService: UserService,
    private entryService: EntryService,


    private router: Router, 
    private http: HttpClient


  ) { }

  ngOnInit() {

    if (localStorage.access_token) {
        console.log(this.id)

      this.getUser();
      this.getProfile();

    }
    else {
      this.router.navigate(["login"]);
    }
  }


 

  public async getUser(): Promise<void> {
    try {
      const res = await this.userService.getUser<JsonObject>(this.id);
      this.user = res.data;
      console.log(this.user);
    } catch ( error ) {
      console.error( error );
    }
  }

  public async getEntries(): Promise<void> {
    try {
      const res = await this.entryService.getEntries<JsonObject>(this.profile_id);
      this.entries = res.data;
      console.log(this.profile_id);
    } catch ( error ) {
      console.error( error );
    }
  }



  public async getProfile(): Promise<void> {

    let params = new HttpParams();
    params = params.append('filter[uid.id]', this.id);

    try {

      await this.http.get<JsonObject>('http://localhost:8888/jsonapi/profile/user', {params: params})
      .subscribe(event => {
        this.profile = event.data;
        this.profile_id = event.data[0]["id"]
        this.getEntries();

      });
      
     
      
    } catch ( error ) {
      console.error( error );
    }
  }

  

}
