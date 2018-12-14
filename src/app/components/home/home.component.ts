import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Profile } from '../../models/profile';
import { ProfileService } from './../../services/profile.service';
import { JsonObject } from '../../models/json';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

  
})
export class HomeComponent implements OnInit {
  public profile: Profile[];

  @ViewChild('myTemplate', {read: TemplateRef}) myTemplate: TemplateRef<any>;

  constructor(
    private profileService: ProfileService

  ) { }

  ngOnInit() {
    this.getName();
  }

  public async getName(): Promise<void> {
    try {
      const res = await this.profileService.getProfile<JsonObject>();
      this.profile = res.data;
      console.log(this.profile);
    } catch ( error ) {
      console.error( error );
    }
  }

}
