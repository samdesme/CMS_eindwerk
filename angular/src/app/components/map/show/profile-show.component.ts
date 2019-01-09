import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Profile, Attributes } from '../../../models/profile';
import { User } from '../../../models/user';

import { ProfileImg, ImgAttributes } from '../../../models/profile_picture';
import { NewFile } from '../../../models/file';

import { DatePipe } from '@angular/common'

import { ProfileService } from './../../../services/profile.service';
import { AuthService } from './../../../services/auth.service';
import { UserService } from "../../../services/user.service";
import { GoalService } from "../../../services/goal.service";

import { JsonObject } from '../../../models/json';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { RatingChangeEvent } from 'angular-star-rating';


@Component({
  selector: 'app-profile-show',
  templateUrl: './profile-show.component.html',
  styleUrls: ['./profile-show.component.scss'],


})
export class ProfileShowComponent implements OnInit {
  public profile: Profile[];
  public user: User[];
  datepipe: DatePipe = new DatePipe('en-US');

  onRatingChangeResult: RatingChangeEvent;


  
  profile_id: number;
  profile_uid: string;
  uid: number;

  public profile_picture: ProfileImg[];

  id = this.route.snapshot.paramMap.get('id');
  token;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private userService: UserService,
   private goalService: GoalService,

    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient

  ) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getImg();
    this.getProfile();
   
  }




  public async getUser(id: string): Promise<void> {
    try {
      const res = await this.userService.getUser<JsonObject>(id);
      this.user = res.data

    } catch (error) {
      console.error(error);
    }
  }



  public async getProfile(): Promise<void> {


    try {

      await this.http.get<JsonObject>(`http://localhost:8888/jsonapi/profile/user/${this.id}`)
      .subscribe(event => {

        this.profile = event.data;
        let user_id = event.data["relationships"]["uid"]["data"]["id"];
        this.getUser(user_id);


        console.log(this.profile)

  
      });
      
      
    } catch ( error ) {
      console.error( error );
    }
  }

  public async getImg(): Promise<void> {
    const res = await this.profileService.getProfileImg<JsonObject>(this.id);
    this.profile_picture = res.data;

    console.log(this.profile_picture);
  }

 


}
