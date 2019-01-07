import { Injectable } from "@angular/core";
import axios from "axios";
import { AxiosInstance } from "axios";
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class EntryService {
  postEntryURL = 'http://localhost:8888/node?_format=json';
  getEntriesURL = 'http://localhost:8888/jsonapi/node/entries';
  


  
  constructor() {

  }


  public async getEntries<T>(id: string): Promise<T> {
    try {
      const res = await axios.request<T>({
        method: 'get',
        url: `${this.getEntriesURL}?filter[field_profile.id]=${id}`
      });
      return res.data;

    } catch (error) {
      return Promise.reject(this.handleError(error));
    }
  }

  public async postEntry<T>(body: Object, token:string): Promise<T> {
    try {
        const axiosResponse = await axios.request<T>({
            method: 'post',
            url: `${this.postEntryURL}`,
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
