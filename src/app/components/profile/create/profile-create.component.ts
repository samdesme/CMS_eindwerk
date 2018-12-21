import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Profile, Attributes } from '../../../models/profile';
import { ProfileImg, ImgAttributes } from '../../../models/profile_picture';
import { NewFile } from '../../../models/file';

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
  public newFile: NewFile;

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



  public  postFile(strName) {
    let rev_id;
    try {


      const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/octet-stream',
        'Content-Disposition': `file; filename="${this.selectedFile.name}"`,
        'Authorization': 'Basic ' + "cm9vdDpyb290"
       })
   };
  
    this.http.post<NewFile>('http://localhost:8888/file/upload/profile/user/field_profile_picture?_format=json', this.selectedFile, httpOptions)
    .subscribe(event => {
      rev_id = event.fid[0]["value"];
      console.log("NewFile name: ",strName);
      this.patchUser(rev_id, strName)
    });


    } catch ( error ) {
      console.error( error );
    }

   
  }

  public patchUser(rev_id, strName){

    console.log("name : ",strName);
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
        "target_id": rev_id
        }
      ],
      "field_username": [
        {
        "value": strName
        }
      ]
    }

    this.http.patch('http://localhost:8888/profile/1?_format=json', request, httpOptionsPatch)
    .subscribe(event => {
      console.log(event);
      this.router.navigate(["profile"]);
    });
  }

  public editProfile(name){
    let strName = name.value
    try {

      /* this.uploadFile();

      const patchObject = new JsonObject;
      this.newProfile = new Profile;
      this.newProfile.id = this.id;
      this.newProfile.attributes = new Attributes;
      this.newProfile.attributes.name = name.value;
      this.newProfile.attributes.revision_id = this.revision_id;
      
      patchObject.data = this.newProfile;
      console.log(patchObject);
      const jsonResponse = this.profileService.editProfile<JsonObject>(this.id, patchObject);
      console.log(jsonResponse); */


      this.postFile(strName);
      
    } catch ( error ) {
      console.error( error );
    }
  }

}
