import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-my-input-idea',
  templateUrl: './my-input-idea.component.html',
  styleUrls: ['./my-input-idea.component.css']
})
export class MyInputIdeaComponent implements OnInit {

  Approver = "Approver";

  helper = new JwtHelperService();
  emailId: any;
  userId: any;
  
  constructor() { }

  ngOnInit(): void {
    const decodedToken = this.helper.decodeToken(localStorage.getItem('token'));
    this.userId = decodedToken.id;
    this.emailId = decodedToken.email;
  
  }

}