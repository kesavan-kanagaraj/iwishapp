import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { YaziApiProvider } from '../../providers/providers';
import { IEcards,IUserDetails,IUserPostInfo } from '../../interfaces/interfaces';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import { CardDetailsPage } from '../card-details/card-details';
import { UriHelpers } from '../../helpers/helpers';
import { Storage } from '@ionic/storage';
import { DebugContext } from '@angular/core/src/view';


//ionic cordova plugin add cordova-plugin-facebook4 --variable APP_ID="1122455967826041" --variable APP_NAME="iwishu" npm install --save @ionic-native/facebook
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  private eCards : IEcards[];
  private userDetails : IUserDetails;
  public categoryName: string;
  private data  : IUserDetails ={
     email : "sadcd@gmail.com",
     name : "kumaran",
     profileImgUrl : "https://iwishu.in/ecard/images/inner-peace.jpg",
     socialId : "123456",
     gender : "male",
     isLoggedIn : false
  };

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private yahi: YaziApiProvider,
    public storage: Storage,
    private loadingController: LoadingController) 
    { 
      this.categoryName = (navParams.get('category') == undefined || navParams.get('category') == "all") ? "all" : navParams.get('category');
      console.log("HomePage: "+ this.categoryName); 
    
    }

    ngOnInit() : void {
       console.log('on init ..');
       this.getUserDetails();
       this.fetchEcards();
    }

    getUserDetails(){
      this.storage.get("iwishuser").then((value) => {
        
        console.log(value);
        if(value!=null){
          var userInfo : IUserDetails = JSON.parse(value);
          this.userDetails = userInfo;
        }
        else{
          this.userDetails = null;
        }
     })
    }

  fetchEcards(){
    let loader = this.loadingController.create({
      content: 'Getting iwishes...'
    });

    loader.present().then(() => {
      var socialId = this.userDetails == null ? "" : this.userDetails.socialId;
      this.yahi.getEcards(this.categoryName,socialId).then(data => {
        
        var jsonData = JSON.stringify(data);
        this.eCards =  JSON.parse(jsonData);
        loader.dismiss();
      })
      .catch(data => console.log(data));
    });
  }

  updateLikes(index:string){
    
    var currentWishStatus = this.eCards[index].isLiked;
    this.eCards[index].likes;
    if(currentWishStatus){
      this.eCards[index].isLiked = false;
      this.eCards[index].likes = this.eCards[index].likes - 1;
    }
    else{
      this.eCards[index].isLiked = true;
      this.eCards[index].likes = this.eCards[index].likes + 1;
    }
    
    var userPostData:IUserPostInfo ={
        userSocialId:this.userDetails.socialId,
        postInfoId:this.eCards[index].id,
        isLiked:this.eCards[index].isLiked
    };
    this.yahi.putService(`${UriHelpers.baseUrl + UriHelpers.upsertUserPostInfo}`, userPostData);
  }

  checkAuthentication(index:string) {
    
    if(this.userDetails==null){
      this.navCtrl.setRoot(LoginPage,{
        category: this.categoryName,
        postId: this.eCards[index].id
      });
      this.navCtrl.popToRoot();
    }
    else{
      this.updateLikes(index);
    }

    // this.navCtrl.setRoot(HomePage, {
    //   category: "this.categoryName"
    // });/
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

  goToCardDetails(cardDetail:IEcards){
    var id= cardDetail.id;
    var socialId= this.userDetails==null ? "" : this.userDetails.socialId
    console.log(id);
    this.navCtrl.push(CardDetailsPage, {
      id: id,
      socialId: socialId
    });
    
  }
}
