import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import axios from 'axios';



@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private fetchURL = 'http://localhost:8888/jsonapi/profile/user';
  private fetchUserURL = 'http://localhost:8888/jsonapi/user/user';



  constructor() {}
  
  public async getUser<T>(id: string): Promise<T> {
    try {
      const res = await axios.request<T>({
        method: 'get',
        url: `${this.fetchUserURL}/${id}`
      });
      return res.data;
    } catch (error) {
      return Promise.reject(this.handleError(error));
    }
  }

  public async getProfiles<T>(): Promise<T> {
    try {
      const res = await axios.request<T>({
        method: 'get',
        url: this.fetchURL
      });
      return res.data;
    } catch (error) {
      return Promise.reject(this.handleError(error));
    }
  }



  public async getProfile<T>(id: string): Promise<T> {
    try {
      const res = await axios.request<T>({
        method: 'get',
        url: `${this.fetchURL}/${id}?include=field_profile_picture`
      });
      return res.data;
    } catch (error) {
      return Promise.reject(this.handleError(error));
    }
  }

  public async getProfileImg<T>(id: string): Promise<T> {
    try {
      const res = await axios.request<T>({
        method: 'get',
        url: `${this.fetchURL}/${id}/field_profile_picture`
      });
      return res.data;
    } catch (error) {
      return Promise.reject(this.handleError(error));
    }
  }

  public async editProfile<T>(id: string, body: Object): Promise<T> {
    try {
        const axiosResponse = await axios.request<T>({
            method: 'patch',
            url: `${this.fetchURL}/${id}`,
            data: body
        });
        return( axiosResponse.data );
    } catch ( error ) {
        return( Promise.reject( this.handleError( error ) ) );
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

