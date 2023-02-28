import { Component, Inject, Input, OnInit } from '@angular/core';
import { IdeaService } from 'src/app/shared/idea.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/shared/user.service';
@Component({
  selector: 'app-commentliked',
  templateUrl: './commentliked.component.html',
  styleUrls: ['./commentliked.component.css'],
})
export class CommentlikedComponent implements OnInit {
  @Input() public comment_id: string;
  Organisation: any;
  organisationDomain: any;
  organisationId: any;
  CommentLikeUserList: any;

  constructor(
    public _userService: UserService,
    private _ideaService: IdeaService,
    private _orgService: OrganisationService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {}

  ngOnInit(): void {
    this._orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res: any) => {
        this.Organisation = res;
        this.organisationDomain =
          this.Organisation.organisations.organisationDomain;
        this.organisationId = this.Organisation.organisations.id;
        var value = {
          commentId: this.comment_id,
          organisationDomain: this.organisationDomain,
        };
        this._ideaService.GetCommentLikeById(value).subscribe(
          (res: any) => {
            this.CommentLikeUserList = res;
            this.CommentLikeUserList=this.CommentLikeUserList.commentLikes;
          },
          (err: any) => {}
        );
      },
      (err) => {}
    );
  }
}
