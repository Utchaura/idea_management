import { Component, Inject, Input, OnInit } from '@angular/core';
import { IdeaService } from 'src/app/shared/idea.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-commentdisliked',
  templateUrl: './commentdisliked.component.html',
  styleUrls: ['./commentdisliked.component.css'],
})
export class CommentdislikedComponent implements OnInit {
  @Input() public comment_id: string;
  Organisation: any;
  organisationDomain: any;
  organisationId: any;
  CommentUnlikeUserList: any;
  constructor(
    public _userService: UserService,
    private _ideaService: IdeaService,
    private _orgService: OrganisationService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {}

  ngOnInit(): void {
    this._orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.Organisation = res;
        this.organisationDomain =
          this.Organisation.organisations.organisationDomain;
        this.organisationId = this.Organisation.organisations.id;
        var value = {
          commentId: this.comment_id,
          organisationDomain: this.organisationDomain,
        };
        this._ideaService.GetCommentUnlikeById(value).subscribe(
          (res: any) => {
            this.CommentUnlikeUserList = res;
            this.CommentUnlikeUserList= this.CommentUnlikeUserList.commentUnlikes;
         
          },
          (err: any) => {}
        );
      },
      (err) => {}
    );
  }
}
