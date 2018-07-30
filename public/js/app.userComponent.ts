import { Component } from '@angular/core';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'user-component',
  template: ''
})
export class UserComponent {

   constructor(private socket: Socket) {
      socket.on('new notification', function(data){
         alert(data)
      });
   }
}
