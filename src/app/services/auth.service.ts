import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public fetchURL = 'http://localhost:8888/oauth/token';
  constructor() {}

  public async getToken<T>(): Promise<T> {
    try {
      const res = await axios.request<T>({
        method: 'get',
        url: `${this.fetchURL}`
      });
      return res.data;
    } catch (error) {
      return Promise.reject(this.handleError(error));
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
