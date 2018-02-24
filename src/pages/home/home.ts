import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { YaziApiProvider } from '../../providers/providers';
import { IEcards } from '../../interfaces/interfaces';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  private eCards : IEcards[];

  constructor(
    private navCtrl: NavController,
    private yahi: YaziApiProvider,
    private loadingController: LoadingController) { 

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




}
