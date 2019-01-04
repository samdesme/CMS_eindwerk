import { Injectable } from "@angular/core";
import axios from "axios";
import { AxiosInstance } from "axios";
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class GoalService {
  postGoalURL = 'http://localhost:8888/node?_format=json';
  getGoalURL = 'http://localhost:8888/jsonapi/node/goals';
  

  private axiosClient: AxiosInstance;
  constructor() {
    this.axiosClient = axios.create();
  }


  public async getGoals<T>(id: string): Promise<T> {
    try {
      const res = await axios.request<T>({
        method: 'get',
        url: `${this.getGoalURL}?filter[revision_uid.id]=${id}&filter[status]=1`
      });
      return res.data;

    } catch (error) {
      return Promise.reject(this.handleError(error));
    }
  }

  public async postGoal<T>(body: Object, token:string): Promise<T> {
    try {
        const axiosResponse = await axios.request<T>({
            method: 'post',
            url: `${this.postGoal}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
    
          },
            data: body
           
        });
        return( axiosResponse.data );
    } catch (e) {
      return e.response["data"]["message"];
    }
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
