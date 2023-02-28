import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from 'src/app/shared/user.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { IdeaService } from 'src/app/shared/idea.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { identifierModuleUrl } from '@angular/compiler';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {

  title :string="";
  helper = new JwtHelperService();
  userId: any;
  Organisation: any;
  allIdeas: any;
  users: any;
  organisationDomain: any;
  profilePic: '';
  userName: string =  "";
  IdeaStatement:string="";
  img:'';
  Description: any;
  email:any;


  CommentForm = new FormGroup({
    message: new FormControl('',Validators.required)
  });
  id: any;
  IdeaId: any;
  orgDomain: any;

  constructor(private _activatedRoute: ActivatedRoute,
    private _ideaService: IdeaService,
    public _userService: UserService,
    private _orgService: OrganisationService,
    private modalService: NgbModal,
    @Inject(SUB_DOMAIN) private _subdomain:string) { }

  ngOnInit(): void {

    const decodedToken = this.helper.decodeToken(localStorage.getItem('token'));
    this.userId = decodedToken.id;
    this.email= decodedToken.email;

    this._orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.Organisation = res;
          this.organisationDomain = this.Organisation.organisations.organisationDomain;
          var value = {
            id : this.userId,
            organisationDomain: this.organisationDomain,
          }

          this._userService.getUserById(value).subscribe(
            (res) => {
              this.users = res;

              this.profilePic = this.users.users.userImage.imageSrc;
              var firstName = this.users.users.firstName;
              var lastName = this.users.users.lastName;
              this.userName = firstName +' '+ lastName;
            },
            (err) => {
            }
          )
      },
      (err) => {
      })

     const id=this._activatedRoute.snapshot.queryParams.id;
    this.id=this._activatedRoute.snapshot.queryParams.id;
    this.IdeaId=this.id


    const organisationDomain=this._activatedRoute.snapshot.queryParams.OrganisationDomain;
    this.organisationDomain=this._activatedRoute.snapshot.queryParams.OrganisationDomain;
    this.orgDomain=this.organisationDomain


    this._ideaService.getIdeaById({id,organisationDomain}).subscribe(
      (res:any) =>{
        // this.userEditForm.patchValue(res['users']);
         var allIdeas=res;
         this.IdeaStatement=allIdeas.ideas.statement

         this.img=allIdeas.ideas.ideaCoverImg.imageSrc
          this.title = allIdeas.ideas.title
          this.Description = allIdeas.ideas.description

      },
      (err: any) => {
      }
    )

  }

  saveComment()
  {

    var value = {
      message: this.CommentForm.value.message,
      ideaId:this.IdeaId,
      username:this.userName,
      organisationDomain:this.orgDomain,
      userId:this.userId,
      userImage:this.users.users.userImage.imageSrc,
      emailId:this.email
  }

  this._ideaService.createComment(value).subscribe(
    (res:any) =>{
      // this.userEditForm.patchValue(res['users']);
       var comment=res;
       this.modalService.dismissAll();

    },
    (err: any) => {
    }
  )

  }

}
