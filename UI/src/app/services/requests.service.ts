import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http"
import {SnackbarService} from "./snackbar.service";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  public environmentUrl: string = "http://3.131.123.24:8000/";
  private user = JSON.parse(localStorage.getItem('user'))

  constructor(private http: HttpClient, private snackBar: SnackbarService) {
  }

  public async sendGetRequest(path: string, params: Object = {}): Promise<any> {
    let parameters = await this.buildParams(params);
    return await new Promise((resolve) => {
      this.http.get(this.environmentUrl + path, {params: parameters}).subscribe({
        next: (data: any) => {
          if (data) {
            resolve(data)
          } else {
            resolve("No Data Found")
          }
        }, error: error => resolve(error)
      })
    })
  }

  public async sendPostRequest(path: string, body: Object = {}): Promise<any> {
    return await new Promise((resolve) => {
      this.http.post(this.environmentUrl + path, this.user ? {body, 'userID': this.user.id} : {body}).subscribe({
        next: (data: any) => {
          if (data)
            resolve(data)
          else
            resolve("No Data Found")
        }, error: error => resolve(error)
      })
    })
  }

  public async sendDeleteRequest(path: string, params: Object = {}): Promise<any> {
    let parameters = await this.buildParams(params);
    return await new Promise((resolve) => {
      this.http.delete(this.environmentUrl + path, {params: parameters}).subscribe({
        next: (data: any) => {
          if (data)
            resolve(data)
          else
            resolve("No Data Found")
        }, error: error => resolve(error)
      })
    })
  }

  public async sendPutRequest(path: string, body: Object = {}): Promise<any> {
    return await new Promise((resolve) => {
      this.http.put(this.environmentUrl + path,
        this.user ? {body, 'userID': this.user.id} : {body}).subscribe({
        next: (data: any) => {
          if (data)
            resolve(data)
          else
            resolve("No Data Found")
        }, error: error => resolve(error)
      })
    })
  }

  public buildParams(paramsObj: Object) {
    let params = new HttpParams();
    Object.keys(paramsObj).forEach((k) => {
      params = params.set(k, paramsObj[k])
    })
    params = this.user ? params.set('userID', this.user.id) : params
    return params
  }

  logError(errorResponse) {
    console.error("Real Error Message: ", errorResponse)
    if (errorResponse.error) {
      if (errorResponse.error.errors) {
        this.snackBar.openSnackbar(errorResponse.error.errors[0])
      } else if (errorResponse.error.error) {
        this.snackBar.openSnackbar(errorResponse.error.error)
      } else {
        this.snackBar.openSnackbar(errorResponse.statusText)
      }
    } else {
      this.snackBar.openSnackbar(errorResponse.statusText)
    }

  }
}
