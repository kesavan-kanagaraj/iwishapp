import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { YaziApiProvider } from '../../providers/providers';
import { IEcards } from '../../interfaces/interfaces';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  private eCards : IEcards[];
  public categoryName: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private yahi: YaziApiProvider,
    private loadingController: LoadingController) { 
      this.categoryName = navParams.get('category') == undefined ? "all" : navParams.get('category');
      console.log("HomePage: "+ this.categoryName); 
    }

    ngOnInit() : void {
       console.log('on init ..');
       this.fetchEcards();
    }

  fetchEcards(){
    let loader = this.loadingController.create({
      content: 'Getting iwishes...'
    });

    loader.present().then(() => {
      this.yahi.getEcards().then(data => {
        var jsonData = JSON.stringify(data);
        this.eCards =  JSON.parse(jsonData);
        loader.dismiss();
      });
    });
  }

  checkAuthentication() {
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
    // this.navCtrl.setRoot(HomePage, {
    //   category: "this.categoryName"
    // });
  }




}
