import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { YaziApiProvider } from '../../providers/providers';
import { UriHelpers } from '../../helpers/helpers';
import { Storage } from '@ionic/storage';
import { IEcards, IUserDetails, IUserPostInfo } from '../../interfaces/interfaces';
import { HomePage } from '../home/home';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private isLoggedIn: boolean = false;
  private users: any;
  private userDetails: IUserDetails = {
    email: "",
    name: "",
    profileImgUrl: "",
    socialId: "",
    gender: "",
    isLoggedIn: false
  };
  private categoryName: string;
  private postId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private yahi: YaziApiProvider,
    public storage: Storage,
    private fb: Facebook) {

    
    this.categoryName = navParams.get('category') == undefined ? "all" : navParams.get('category');
    this.postId = navParams.get('postId') == undefined ? "" : navParams.get('postId');

    fb.getLoginStatus()
      .then(res => {
        console.log(res.status);
        if (res.status === "connected") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log(e));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // setLoggedInStatus(response: any) {
  //   
  //   console.log(response.status);
  //   if (response.status === "connected") {
  //     //this.isLoggedIn = true;
  //     this.userDetails.isLoggedIn = true;
  //   } else {
  //     //this.isLoggedIn = false;
  //     this.userDetails.isLoggedIn = false;
  //   }
  // }

  // setUserDetails(response: any) {
  //   
  //   console.log(response);
  //   this.users = response;
  //   this.userDetails = {
  //     email: response.email,
  //     name: response.name,
  //     gender: response.gender,
  //     socialId: response.id,
  //     profileImgUrl: response.picture.data.url,
  //     isLoggedIn: true,
  //   }
  //   this.insertUserDetailsInStorage('iwishuser', this.userDetails);
  //   this.yahi.putService(`${UriHelpers.baseUrl + UriHelpers.upsertUserInfo}`, this.userDetails);
  // }

  // logError(error: any) {
  //   
  //   console.log(error);
  // }


  getUserDetail(userid) {
    this.fb.api("/" + userid + "/?fields=id,email,name,picture,gender", ["public_profile"])
      .then(res => {
        
        console.log(res);
        this.users = res;
        this.userDetails = {
          socialId: res.id,
          email: res.email,
          gender: res.gender,
          isLoggedIn: true,
          name: res.name,
          profileImgUrl: res.picture.data.url
        };
        this.insertUserDetailsInStorage('iwishuser', this.userDetails);
        this.yahi.putService(`${UriHelpers.baseUrl + UriHelpers.upsertUserInfo}`, this.userDetails);
        
        if (this.postId != "") {
          var userPostData: IUserPostInfo = {
            userSocialId: this.userDetails.socialId,
            postInfoId: this.postId,
            isLiked: true
          };
          this.yahi.putService(`${UriHelpers.baseUrl + UriHelpers.upsertUserPostInfo}`, userPostData);
        }
        this.gotToHomePage(this.categoryName);
      })
      .catch(e => {
        
        console.log(e);
      });
  }

  // handleLoginResponse(response: any) {
  //   
  //   this.setLoggedInStatus(response);
  //   if (response.status === "connected") {
  //     this.getUserDetail(response.authResponse.userID);
  //   }
  // }

  insertUserDetailsInStorage(settingName: string, value: IUserDetails) {
    
    var stringifiedData = JSON.stringify(value);
    this.storage.set(settingName, stringifiedData);
  }


  login() {
    
    if (this.platform.is('cordova')) {
      this.fb.login(['public_profile', 'user_friends', 'email'])
        .then(res => {
          
          if (res.status === "connected") {
            this.isLoggedIn = true;
            this.getUserDetail(res.authResponse.userID);
          } else {
            this.isLoggedIn = false;
          }
        })
        .catch(e => console.log('Error logging into Facebook', e));
    }
  }

  // setLoggedOut() {
  //   
  //   this.storage.get("iwishuser").then((value) => {
  //     var userInfo: IUserDetails = JSON.parse(value);
  //     userInfo.isLoggedIn = false; this.userDetails.isLoggedIn = false;
  //     this.userDetails = userInfo;
  //   })
  // }

  logout() {
    
    this.fb.logout()
      .then(
      res => {
        
        this.storage.get("iwishuser").then((value) => {
          
          var userInfo: IUserDetails = JSON.parse(value);
          userInfo.isLoggedIn = false; this.userDetails.isLoggedIn = false;
          this.userDetails = userInfo;
        })
      })
      .catch(e => console.log('Error logout from Facebook', e));
  }

  gotToHomePage(categoryName: string) {
    this.navCtrl.setRoot(HomePage, {
      category: categoryName
    });
    this.navCtrl.popToRoot();
  }
}
