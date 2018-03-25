import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { UriHelpers } from '../../helpers/helpers';
import { Storage } from '@ionic/storage';
import { YaziApiProvider } from '../../providers/providers';
import { IEcards, IUserDetails, IUserPostInfo } from '../../interfaces/interfaces';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the CardDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-card-details',
  templateUrl: 'card-details.html',
})
export class CardDetailsPage {

  public Id: string;
  public socialId: string;
  private userDetails: IUserDetails;
  private eCard: IEcards;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingController: LoadingController,
    private yahi: YaziApiProvider,
    public storage: Storage, ) {
    
    console.log("CardDetailsPage: " + navParams.get('id'));
    this.Id = navParams.get('id');
    this.socialId = navParams.get('socialId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardDetailsPage');
  }

  ngOnInit(): void {
    console.log('on init ..');
    this.fetchEcard(this.Id);
    this.getUserDetails();
  }

  getUserDetails() {
    
    this.storage.get("iwishuser").then((value) => {
      
      if (value != null) {
        var userInfo: IUserDetails = JSON.parse(value);
        this.userDetails = userInfo;
      }
      else {
        
        this.userDetails = null;
      }
    })
  }

  fetchEcard(Id: string) {
    
    let loader = this.loadingController.create({
      content: 'Getting iwishes...'
    });

    loader.present().then(() => {
      this.yahi.getEcard(this.Id, this.socialId).then(data => {
        
        var jsonData = JSON.stringify(data);
        this.eCard = JSON.parse(jsonData);
        loader.dismiss();
      })
        .catch(data => console.log(data));
    });
  }

  updateLikes(CardId: string) {
    
    var currentWishStatus = this.eCard.isLiked;
    if (currentWishStatus) {
      this.eCard.isLiked = false;
      this.eCard.likes = (+this.eCard.likes - 1).toString();
    }
    else {
      this.eCard.isLiked = true;
      this.eCard.likes = (+this.eCard.likes + 1).toString();
    }
    
    var userPostData: IUserPostInfo = {
      userSocialId: this.userDetails.socialId,
      postInfoId: this.eCard.id,
      isLiked: this.eCard.isLiked
    };
    this.yahi.putService(`${UriHelpers.baseUrl + UriHelpers.upsertUserPostInfo}`, userPostData);
  }

  checkAuthentication(CardId: string) {
    
    if (this.userDetails == null) {
      this.navCtrl.setRoot(LoginPage);
      this.navCtrl.popToRoot();
    }
    else {
      this.updateLikes(CardId);
    }

    // this.navCtrl.setRoot(HomePage, {
    //   category: "this.categoryName"
    // });
  }

  gotToProfile(){
    
    if(this.userDetails==null){
      this.navCtrl.setRoot(LoginPage);
      this.navCtrl.popToRoot();
    }
    else{
      
      this.navCtrl.push(ProfilePage);
    }
  }

}
