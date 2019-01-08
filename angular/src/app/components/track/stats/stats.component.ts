import { Component, OnInit, ViewChild, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Profile } from '../../../models/profile';
import { User } from '../../../models/user';
import { Entry } from '../../../models/entry';

import { ProfileService } from '../../../services/profile.service';
import { UserService } from '../../../services/user.service';
import { EntryService } from "../../../services/entry.service";

import { JsonObject } from '../../../models/json';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileImg, ImgAttributes } from '../../../models/profile_picture';
import { LocalstorageService } from "../../../services/localstorage.service";
import { HttpParams, HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  encapsulation: ViewEncapsulation.None


})
export class StatsComponent implements OnInit {

  @Input() statsTemplate: TemplateRef<any>;

  public profile: Profile;
  public user: User[];
  public entries: Entry[];


  public profile_picture: ProfileImg[];

  id = localStorage.getItem("uuid");
  dataHours: Array<number> = new Array<number>();
  dataDates: Array<string> = new Array<string>();
  datepipe: DatePipe = new DatePipe('en-US');

  profile_id: string;

  @ViewChild('navTemplate', { read: TemplateRef }) navTemplate: TemplateRef<any>;

  constructor(
    private profileService: ProfileService,
    private userService: UserService,
    private entryService: EntryService,

    private router: Router,
    private http: HttpClient


  ) { }

  ngOnInit() {

    if (localStorage.access_token) {

      this.getUser();
      this.getProfile();
      this.getEntries();
      console.log(this.dataDates)

    }
    else {
      this.router.navigate(["login"]);
    }
  }


  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(255,255,255,0)',
      borderColor: 'rgba(255,255,255,1)',
      pointBackgroundColor: 'rgba(255,255,255,1)',
      fillColor: '#fff',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#648ED0',
      pointHoverBorderColor: 'rgba(255,255,255,1)',

    }
  ]
  public lineChartData: Array<any> = [
    { data: this.dataHours, label: 'Uren slaap' }
  ];
  public lineChartLabels: Array<any> = this.dataDates;
  public lineChartOptions: any = {
    scales: {
      xAxes: [{
        gridLines: {
          color: 'rgba(255,255,255,0.3)'
        },
        ticks: {
          fontColor: 'rgba(255,255,255,1)',
          fontSize: 12
        }
      },
      ],
      yAxes: [{
        gridLines: {
          color: 'rgba(255,255,255,0.3)'

        },
        ticks: {
          fontColor: 'rgba(255,255,255,1)',
          fontSize: 12
        }
      }]
    },
    legend: {
      labels: {
        fontColor: '#ffffff'
      }
    },


    responsive: true
  };


  public lineChartType: string = 'line';


  refreshPage(): void {
    window.location.reload();
  }

  public async getUser(): Promise<void> {
    try {
      const res = await this.userService.getUser<JsonObject>(this.id);
      this.user = res.data;
      console.log(this.user);
    } catch (error) {
      console.error(error);
    }
  }

  public async getEntries(): Promise<void> {
    try {
      const res = await this.entryService.getEntries<JsonObject>(this.profile_id);
      this.entries = res.data;

      for (let i = 0; i < res.data.length; i++) {

        let bedT = new Date("January 1, 1970 " + res.data[i]['attributes']['field_bedtime'])
        let riseT = new Date("January 1, 1970 " + res.data[i]['attributes']['field_risen'])
        var timeDiff = riseT.getTime() - bedT.getTime();
        let diff = Math.round(Math.abs(timeDiff / (1000 * 60 * 60)));
        let dateFormat = this.datepipe.transform(res.data[i]['attributes']['field_created'], 'dd MMM');

        if (diff >= 13) {
          diff = diff - 12
        }

        this.dataHours.push(Number(diff.toFixed(diff)));
        this.dataDates.push(dateFormat)

        if (i == 7) {
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }



  public async getProfile(): Promise<void> {

    let params = new HttpParams();
    params = params.append('filter[uid.id]', this.id);

    try {

      await this.http.get<JsonObject>('http://localhost:8888/jsonapi/profile/user', { params: params })
        .subscribe(event => {
          this.profile = event.data;
          this.profile_id = event.data[0]["id"]
          this.getEntries();

        });

    } catch (error) {
      console.error(error);
    }
  }




}
