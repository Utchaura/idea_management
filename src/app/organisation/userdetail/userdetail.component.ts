import { Component, Inject, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StatusCount } from 'src/app/models/StatusCount-model';
import { User } from 'src/app/models/user-model';
import { AuthService } from 'src/app/services/auth.service';
import { IdeaService } from 'src/app/services/idea.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})

export class UserdetailComponent implements OnInit {

  @Input() public idea_status: number;

  @Input() public recent_idea: string = null;

  helper = new JwtHelperService();
  Organisation: any;
  allIdeas: any;
  userId: any;
  users: any;
  organisationDomain: any;
  organisationId: any;
  emailId: any;
  userList: any;
  IdeaStatus: any;
  profilePic: any;
  coverPic:any;
  ideapost: boolean = false;
  finalEmail: any;
  totalposts: any;
  userName:any;
  designation:any;
  location:any;

  headline: any;
  mobileNo: any;
  loggedUserId: any;
  status: StatusCount = {
    status: {
      draft: 0,
      approved: 0,
      publish :0,
      underApproval: 0,
      open: 0,
      approver: 0,
      backlog: 0
    }
  };
  userProfileImage: string;
  localUser: any;
  needMyInput: boolean = false;
  Id: string;

    constructor(
      public _orgService: OrganisationService,
    private _route: Router,
    public _userService: UserService,
    public _authService: AuthService,
    private _ideaService: IdeaService,
    private _toastr: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private _sanitizer: DomSanitizer,
    @Inject(SUB_DOMAIN) private _subdomain: string,)
    {
      this._userService.getUpdatedCoverImage().subscribe((res)=>{
        this.getUserByIds();
      });

    }

  ngOnInit(): void {
    this.localUser = this._authService.getUser();
    const decodedToken = this.helper.decodeToken(localStorage.getItem('token'));
    this.loggedUserId = decodedToken.id;



   this.getUserByIds();
   this.GetIdeaByUserId();
    this._ideaService.GetStatusCount(this._subdomain).subscribe(
      (res: StatusCount)=>{
        this.status = res;


      },
      (err:any) => {}
    );
  }

  getUserByIds()
  {
    // var id=this._activatedRoute.snapshot.queryParams.id;
    // this.userId= this._activatedRoute.snapshot.queryParams.id;
    // var organisationDomain=this._activatedRoute.snapshot.queryParams.OrganisationDomain;
    // this.organisationDomain=this._activatedRoute.snapshot.queryParams.OrganisationDomain;
    var i = this._activatedRoute.snapshot.paramMap.get('id');
    this.userId = i;
    var localuser = new User();
    localuser.Id = this.userId;
    localuser.OrganisationDomain = this._subdomain;
    this._userService.getUserById(localuser).subscribe(
    (res:any) =>{
      this.users=res;
      var firstName = this.users.users.firstName;
      var lastName = this.users.users.lastName;
      this.userName = firstName + ' ' + lastName;
      this.emailId = this.users.users.emailId;
      this.headline = this.users.users.headline;
      this.mobileNo = this.users.users.mobileNo;
      var x: any = this.emailId;
      let email = x.replaceAll("@", '%40');
      this.finalEmail= email;
      if(this.users.users.userCoverImage)
      this.coverPic = this.users.users.userCoverImage.imageSrc + '?' + Math.random();
      this.designation = this.users.users.designation;
      this.location = this.users.users.location;
      this.headline = this.users.users.headline;
      var roles = this.users.users.roles;
      if(roles.includes(3)){
        this.needMyInput = true;
      }
      else{
        this.needMyInput = false;
      }

      if(this.users.users.userImage)
      this.userProfileImage = this.users.users.userImage.imageSrc + '?' + Math.random();



    }

    )

  }

  editDetail(){
      this._route.navigateByUrl('/organisation/update-user/user?id='+this.userId +'&OrganisationDomain='+ this.organisationDomain)
      this.modalService.dismissAll();
    }

  GetIdeaByUserId(){
    this.ideapost=true;
    var value={
      organisationDomain: this._subdomain,
      id :this.userId
    }
    this._ideaService.getIdeasByUserId(value).subscribe(
      (res:any) =>{
        this.allIdeas = res;
        this.allIdeas = this.allIdeas.ideas;
        this.totalposts = this.allIdeas.length;
      },
      (err:any)=>{

      });
  //    this._ideaService.filterByUserId(this.userid);

  }

  changeIdeaStatus(type: any) {
    // this.IdeaStatus = type;
    this._ideaService.ideaStatusTitle(type);

  }

  onClick(idea:any)
{
this._route.navigateByUrl('/organisation/idea-main-details-page?id='+idea.id +'&OrganisationDomain='+idea.organisationDomain)
}


safeUrl(videoUrl: any){
  var str = videoUrl;
  var substr = str.substring(str.length-11, str.length);
  return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+ substr);
}

ShowContactDetails(formContent:any)
{
  this.modalService.open(formContent, { size: 'md',backdrop:'static', });
}

CoverImagePopup(formContent:any)
{
  this.modalService.open(formContent, { size: 'md',backdrop:'static', });
}

}
