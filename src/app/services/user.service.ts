import { Injectable } from "@angular/core";
import axios from "axios";
import { AxiosInstance } from "axios";


@Injectable({
  providedIn: "root"
})
export class UserService {
  apiURL = `http://localhost:8888/oauth/token`;
  

  private axiosClient: AxiosInstance;
  constructor() {
    this.axiosClient = axios.create();
  }

  login(data) {
    return this.axiosClient.post(this.apiURL, data);
  }

  new_access_token(data) {
    return this.axiosClient.post(this.apiURL, data);
  }
}
