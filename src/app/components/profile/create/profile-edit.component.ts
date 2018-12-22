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
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],

  
})
export class ProfileEditComponent implements OnInit {
  public profile: Profile[];
  public profile_picture: ProfileImg[];
  public newProfile_picture: ProfileImg;

  public newProfile: Profile;
  public newFile: NewFile;

  fileName: string = '';
  msg: string = '';


  id = this.route.snapshot.paramMap.get('id');
  selectedFile: File;
  token;
  
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
    this.selectedFile = event.target.files[0];
    this.changeName(this.selectedFile.name);
  }

  changeName(string):void{
    this.fileName = string;
   }

   changeMsg(string):void{
    this.msg = string;
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



  public  postFile() {
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
      this.patchUserImg(rev_id)
    });


    } catch ( error ) {
      console.error( error );
    }

   
  }

  public patchUserInfo(strName){
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
      "field_username": [
        {
        "value": strName
        }
      ]
    }

    this.http.patch('http://localhost:8888/profile/1?_format=json', request, httpOptionsPatch)
    .subscribe(event => {
      console.log(event);
      if (this.selectedFile != null){
        this.postFile();

      }
      else{
        this.router.navigate(["profile"]);

      }
    });
  }

  public patchUserImg(rev_id){

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

      

     if (strName != ""){
      this.patchUserInfo(strName)

     }
     else
     {
      this.changeMsg("Vul de verplichte velden in!")
     }

    } catch ( error ) {
      console.error( error );
    }
  }

}
