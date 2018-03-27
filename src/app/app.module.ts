import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Facebook } from '@ionic-native/facebook';
import { SocialSharing } from '@ionic-native/social-sharing';



import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { CardDetailsPage } from '../pages/card-details/card-details';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { YaziApiProvider } from '../providers/providers';
import { IonicStorageModule, Storage } from '@ionic/storage';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CardDetailsPage,
    ListPage,
    LoginPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CardDetailsPage,
    ListPage,
    LoginPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpClientModule,
    YaziApiProvider,
    Facebook,
    SocialSharing
  ]
})
export class AppModule {}
