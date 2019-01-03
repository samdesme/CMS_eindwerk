import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { Goal } from '../../models/goal';

import { ProfileService } from './../../services/profile.service';
import { UserService } from './../../services/user.service';
import { GoalService } from "../../services/goal.service";

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
  public user: User[];
  public goal: Goal[];


  public profile_picture: ProfileImg[];
  id = localStorage.getItem("uuid");
  private sub: any;

  @ViewChild('myTemplate', {read: TemplateRef}) myTemplate: TemplateRef<any>;

  constructor(
    private profileService: ProfileService,
    private userService: UserService,
    private goalService: GoalService,


    private router: Router,
    private route: ActivatedRoute,
    private localstorageService: LocalstorageService,    
    private http: HttpClient


  ) { }

  ngOnInit() {

    if (localStorage.access_token) {
        console.log(this.id)
      this.getUser();
      this.getProfile();
      this.getGoal();
      
      console.log(localStorage.getItem("accesss_token"))
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

  public async getUser(): Promise<void> {
    try {
      const res = await this.userService.getUser<JsonObject>(this.id);
      this.user = res.data;
      console.log(this.user);
    } catch ( error ) {
      console.error( error );
    }
  }

  public async getGoal(): Promise<void> {
    try {
      const res = await this.goalService.getGoals<JsonObject>(this.id);
      this.goal = res.data[0];
      console.log(this.goal);
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

  public async getProfile(): Promise<void> {

    let user_id
    let params = new HttpParams();
    params = params.append('filter[uid.id]', this.id);

    try {

      await this.http.get<JsonObject>('http://localhost:8888/jsonapi/profile/user', {params: params})
      .subscribe(event => {
        this.profile = event.data[0];
        user_id = event.data[0]["id"]
        
        this.getImg(user_id)
        console.log(this.profile)

  
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
