import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyNumberPage } from './verify-number';

@NgModule({
  declarations: [
    VerifyNumberPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyNumberPage),
  ],
})
export class VerifyNumberPageModule {}
