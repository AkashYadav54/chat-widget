import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatWidgetComponent } from './chat-widget/chat-widget.component';

const routes: Routes = [
  {path:'chat',component:ChatWidgetComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
