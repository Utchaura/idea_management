import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IdeaService } from 'src/app/services/idea.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-star-rating-form',
  templateUrl: './star-rating-form.component.html',
  styleUrls: ['./star-rating-form.component.css']
})
export class StarRatingFormComponent implements OnInit {
 // @Input() public idea_id: string;
  @Input() public Idea: string;
  @Input() public selectedValue: any;

  @ViewChild('RatingInput') RatingInput: ElementRef;

  stars: number[] = [1, 2, 3, 4, 5];

  organisationDomain: string;
  idea: any;
  idea_id: any;
  windowUrl: string;
  localUrl: string;
  prodUrl: string;
  @Input() public index: number;

  constructor(public _userService: UserService,
    private _ideaService: IdeaService,
    private _orgService: OrganisationService,
    private _toastr: ToastrService,
    private elementRef: ElementRef,
    private modalService: NgbModal,
    private _route: Router,
    @Inject(SUB_DOMAIN) private _subdomain: string) { }


  ngOnInit(): void {
     // http://democompany.poideamanagement.com:4200/organisation/idea-list
     this.windowUrl = window.location.href;
     this.localUrl = 'http://' + this._subdomain + '.poideamanagement.com:4200/organisation/idea-list';
     this.prodUrl = 'http://'+ this._subdomain +'.ideashub.io/organisation/idea-list'
    this.organisationDomain =this._subdomain;
    this.idea= this.Idea;
    this.idea_id=this.idea.id;
    if (this.idea_id) {
      var value = {
        id: this.idea_id,
        organisationDomain: this._subdomain
      }
      this._ideaService.getIdeaById(value).subscribe((res: any) => {

        this.Idea = res;
       })
    }
  }
  countStar(star: number) {
    this.selectedValue = star;
  }

  changeIdeaStatus(e: any) {
    let formData = new FormData();
    formData.append('ideaId', e.id);
    formData.append('organisationDomain', this.organisationDomain);
    formData.append('ideaRating',  this.selectedValue);
    formData.append('status', '3');

    this._ideaService.changeIdeaStatus(formData).subscribe(
      (res) => {

        this._toastr.success('Idea approved Successfully', '', {
          timeOut: 3000,
        });
        this.modalService.dismissAll();
        if(this.windowUrl != this.localUrl && this.windowUrl != this.prodUrl)
        this._route.navigate(['/organisation/idea-main/approved-idea']);
        var value = {
          ideaStatus: '3',
          ideaType: '2'
        }
        this._ideaService.ideaCount(value);
        this._ideaService.ideaApproved(this.idea_id);
        this._ideaService.ideaUpdateEvent(this.idea_id, this.index, true);
      },
      (err) => {
        this._toastr.error('Status change Failed', '', {
          timeOut: 3000,
        });
      }
    );
  }
}
