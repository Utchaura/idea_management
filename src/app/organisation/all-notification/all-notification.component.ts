import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-all-notification',
  templateUrl: './all-notification.component.html',
  styleUrls: ['./all-notification.component.css']
})
export class AllNotificationComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.modalService.dismissAll()
  }

}
