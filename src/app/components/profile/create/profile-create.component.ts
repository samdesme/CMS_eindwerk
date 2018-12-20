import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Profile, Attributes } from '../../../models/profile';
import { ProfileImg, ImgAttributes } from '../../../models/profile_picture';

import { ProfileService } from './../../../services/profile.service';
import { AuthService } from './../../../services/auth.service';

import { JsonObject } from '../../../models/json';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile-create',
  templateUrl: './profile-create.component.html',
  styleUrls: ['./profile-create.component.scss'],

  
})
export class ProfileCreateComponent implements OnInit {
  public profile: Profile[];
  public profile_picture: ProfileImg[];
  public newProfile_picture: ProfileImg;

  public newProfile: Profile;
  id = this.route.snapshot.paramMap.get('id');
  selectedFile: File;
  token;
  revision_id;


  constructor(
    private profileService: ProfileService,
    private authService: AuthService,

    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,



  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getName();
    this.getImg()
    this.getToken();

  
 
  
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }

  onUpload() {
 

      // const uploadData = new FormData();
      // uploadData.append('myFile', this.selectedFile, this.selectedFile.name);

      const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/octet-stream',
        'Content-Disposition': `file; filename="${this.selectedFile.name}"`,
        'Authorization': 'Basic ' + "cm9vdDpyb290"
       })
   };

   
    this.http.post('http://localhost:8888/file/upload/profile/user/field_profile_picture?_format=json', this.selectedFile, httpOptions)
    .subscribe(event => {
      console.log(event);
    });

    

  }

  public async getToken(): Promise<void> {
    try {
      const res =  await this.authService.getToken<String>();
      this.token = res;
      console.log(res);
    } catch ( error ) {
      console.error( error );
    }
    
  }

  public async getName(): Promise<void> {
    try {
      const res = await this.profileService.getProfile<JsonObject>(this.id);
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



  public async patchImg(): Promise<void> {
    
    try {
      const res = await this.profileService.getProfileImg<JsonObject>("a87cc773-bef4-4c56-8ad0-0c6d268eaff2");
      this.newProfile_picture = res.data;
    this.revision_id = this.newProfile_picture.attributes.drupal_internal__fid;
      console.log(this.newProfile_picture.attributes.drupal_internal__fid);

      const httpOptionsPatch = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + "cm9vdDpyb290"
       })
    };
      
      let request : any = 
      {
        "type": "user",
        "field_profile_picture": [
          {
            "target_id": this.revision_id
          }
        ]
      }
  
      this.http.patch('http://localhost:8888/profile/1?_format=json', request, httpOptionsPatch)
      .subscribe(event => {
        console.log(event);
      });

    } catch ( error ) {
      console.error( error );
    }

    return this.revision_id;
   
  }

  public async editProfile(name): Promise<void> {

    try {
   
      this.onUpload();
      this.patchImg();

      // Data for request
      const patchObject = new JsonObject;
      this.newProfile = new Profile;
      this.newProfile.id = this.id;
      this.newProfile.attributes = new Attributes;
      this.newProfile.attributes.name = name.value;
      
      patchObject.data = this.newProfile;
      console.log(patchObject);
      const jsonResponse = await this.profileService.editProfile<JsonObject>(this.id, patchObject);
      console.log(jsonResponse);
      this.router.navigate([`profile`]);
    } catch ( error ) {
      console.error( error );
    }
  }

}
