import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Profile, Attributes } from '../../../models/profile';
import { ProfileImg, ImgAttributes } from '../../../models/profile_picture';
import { NewFile } from '../../../models/file';

import { ProfileService } from './../../../services/profile.service';
import { AuthService } from './../../../services/auth.service';
import { UserService } from "../../../services/user.service";

import { JsonObject } from '../../../models/json';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams, HttpClient, HttpHeaders} from '@angular/common/http';
import axios from 'axios';

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
  uid: string = '';


  id = this.route.snapshot.paramMap.get('id');
  selectedFile: File;
  token;
  
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private userService: UserService,


    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,



  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getUser();
    this.getUsername();
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
  

  public async getUsername(): Promise<void> {
    try {
      const res = await this.profileService.getUser<JsonObject>(this.id);
      this.profile = res.data;
      console.log(this.profile);
    } catch ( error ) {
      console.error( error );
    }
  }

  public async getUser(): Promise<void> {
    try {
      const res = await this.profileService.getUser<JsonObject>(this.id);
      this.uid = res.data["attributes"]["drupal_internal__uid"]
  
      console.log(this.uid);

    } catch ( error ) {
      console.error( error );
    }
  }


  public postFile() {
 let uuid;
    try {


      const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/octet-stream',
        'Content-Disposition': `file; filename="${this.selectedFile.name}"`,
        'Authorization': localStorage.getItem("access_token")
       })
   };
  
    this.http.post<NewFile>('http://localhost:8888/file/upload/profile/user/field_profile_picture?_format=json', this.selectedFile, httpOptions)
    .subscribe(event => {
      uuid = event.fid[0]["value"];

      this.refresh_token().then(response => {
        if(response){
          this.patchProfileImg(uuid)

        } else {
          console.log("error")
        }
      })
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
      'Authorization': localStorage.getItem("access_token")
     })
  };
    
    let request : any = 
    {
      "name": [
        {
        "value": strName
        }
      ]
    }

    this.http.patch(`http://localhost:8888/user/${this.uid}?_format=json`, request, httpOptionsPatch)
    .subscribe(event => {
      console.log(event);
      this.refresh_token().then(response => {
        if(response && this.selectedFile != null) {
          this.postFile();
        } else if (response) {
          this.router.navigate(["profile"]);   
        } else {
         console.log("error")
        }
      });
    });
  }

  public patchProfileImg(rev_id){

    const httpOptionsPatch = {
      headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem("access_token")
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

    this.http.patch(`http://localhost:8888/profile/${this.uid}?_format=json`, request, httpOptionsPatch)
    .subscribe(event => {
      console.log(event);

      this.refresh_token().then(response => {
        if(response){
          this.router.navigate(["profile"]);
        } else {
          console.log("error")
        }
      })

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

  private refresh_token(): Promise<boolean>{
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


}
