import { Component } from '@angular/core';
import { LoadingController,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IEcards,IUserDetails,IUserPostInfo } from '../../interfaces/interfaces';
import { YaziApiProvider } from '../../providers/providers';
import { Facebook } from '@ionic-native/facebook';
import { HomePage } from '../home/home';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private userDetails : IUserDetails;
  private eCards : IEcards[];
  private data  : IUserDetails ={
    email : "sadcd@gmail.com",
    name : "kumaran",
    profileImgUrl : "https://iwishu.in/ecard/images/inner-peace.jpg",
    socialId : "243fdd43",
    gender : "male",
    isLoggedIn : true
 };
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private yahi: YaziApiProvider,
    public storage: Storage,
    private loadingController: LoadingController,
    private fb: Facebook) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ngOnInit() : void {
    console.log('on init ..');
    this.getUserDetails();
 }

  getUserDetails(){
    
    this.storage.get("iwishuser").then((value) => {
      if(value!=null){
        var userInfo : IUserDetails = JSON.parse(value);
        this.userDetails = userInfo;
        this.fetchFavoritiesEcards();
      }
      else{
        this.userDetails = null;
      }
   })
  }

  fetchFavoritiesEcards(){
    
    let loader = this.loadingController.create({
      content: 'Hi '+this.userDetails.name
    });

    loader.present().then(() => {
      var socialId = this.userDetails == null ? "" : this.userDetails.socialId;
      this.yahi.getFavorities(socialId).then(data => {
        
        var jsonData = JSON.stringify(data);
        this.eCards =  JSON.parse(jsonData);
        loader.dismiss();
      })
      .catch(data => console.log(data));
    });
  }

  logout() {
    
    this.fb.logout()
      .then( 
        res => {          
          this.storage.remove('iwishuser').then(() => {
            console.log('name has been removed');
            this.navCtrl.setRoot(HomePage);
            this.navCtrl.popToRoot();
          })
        })
      .catch(e => console.log('Error logout from Facebook', e));
  }
  
}
