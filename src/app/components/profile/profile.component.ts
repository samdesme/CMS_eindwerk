import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Profile } from '../../models/profile';
import { ProfileService } from './../../services/profile.service';
import { JsonObject } from '../../models/json';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileImg, ImgAttributes } from '../../models/profile_picture';
import { LocalstorageService } from "../../services/localstorage.service";
import { HttpParams, HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],

  
})
export class ProfileComponent implements OnInit {
  public profile: Profile[];
  public profile_picture: ProfileImg[];
  id = localStorage.getItem("uuid");
  private sub: any;

  @ViewChild('myTemplate', {read: TemplateRef}) myTemplate: TemplateRef<any>;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private localstorageService: LocalstorageService,    
    private http: HttpClient


  ) { }

  ngOnInit() {

    if (localStorage.access_token) {
        console.log(this.id)
      this.getUsername();
      this.getProfileFilter();
      this.getToken();
      
      
    }
    else {
      this.router.navigate(["login"]);
    }
  }

  public async getToken(): Promise<void> {
    try {
      

      const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/octet-stream',
        'Authorization': localStorage.getItem("access_token")
       })
   };
  
    this.http.post('http://localhost:8888/file/upload/profile/user/field_profile_picture?_format=json', httpOptions)
    .subscribe(event => {
      
      console.log(event)
    });

    } catch ( error ) {
      console.error( error );
    }
    
  }

  public async getUsername(): Promise<void> {
    try {
      const res = await this.profileService.getUser<JsonObject>(this.id);
      this.profile = res.data;
      console.log(this.profile);
    } catch ( error ) {
      console.error( error );
    }
  }

  logout(){
    this.localstorageService.removeItem("access_token");
    this.localstorageService.removeItem("uuid");
    this.localstorageService.removeItem("refresh_token");


    this.router.navigate(["login"]);
  }

  public async getProfileFilter(): Promise<void> {

    let user_id
    let params = new HttpParams();
    params = params.append('filter[uid.id]', this.id);

  

    try {

      await this.http.get<JsonObject>('http://localhost:8888/jsonapi/profile/user', {params: params})
      .subscribe(event => {
        
        user_id = event.data[0]["id"]
        this.getImg(user_id)
        console.log(user_id)
  
      });
      
     
      
    } catch ( error ) {
      console.error( error );
    }
  }

  public async getImg(id: string): Promise<void> {
    const res = await this.profileService.getProfileImg<JsonObject>(id);
    this.profile_picture = res.data;

    console.log(this.profile_picture);
  }

}
