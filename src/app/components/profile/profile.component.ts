import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Profile } from '../../models/profile';
import { ProfileService } from './../../services/profile.service';
import { JsonObject } from '../../models/json';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileImg, ImgAttributes } from '../../models/profile_picture';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],

  
})
export class ProfileComponent implements OnInit {
  public profile: Profile[];
  public profile_picture: ProfileImg[];

  @ViewChild('myTemplate', {read: TemplateRef}) myTemplate: TemplateRef<any>;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {

    this.getName();
    this.getImg();

  }

  public async getName(): Promise<void> {
    try {
      const res = await this.profileService.getProfile<JsonObject>("a87cc773-bef4-4c56-8ad0-0c6d268eaff2");
      this.profile = res.data;
      console.log(this.profile);
    } catch ( error ) {
      console.error( error );
    }
  }

  public async getImg(): Promise<void> {
    try {
      const res = await this.profileService.getProfileImg<JsonObject>("a87cc773-bef4-4c56-8ad0-0c6d268eaff2");
      this.profile_picture = res.data;
      console.log(this.profile_picture);
    } catch ( error ) {
      console.error( error );
    }
  }

  

}
