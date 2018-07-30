import { Component } from '@angular/core';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'admin-component',
  templateUrl: './app.adminComponent.html'
})
export class AdminComponent {

   constructor(private socket: Socket) {}

   sendNotification(){
      this.socket.emit('create notification','Notification Test');
   }
}
