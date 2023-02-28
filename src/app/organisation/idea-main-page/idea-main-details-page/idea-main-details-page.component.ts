import { Component, ElementRef, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StatusCount } from 'src/app/models/StatusCount-model';
import { AuthService } from 'src/app/services/auth.service';
import { IdeaService } from 'src/app/services/idea.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/shared/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'src/app/models/user-model';
import moment from 'moment';

@Component({
  selector: 'app-idea-main-details-page',
  templateUrl: './idea-main-details-page.component.html',
  styleUrls: ['./idea-main-details-page.component.css']
})
export class IdeaMainDetailsPageComponent implements OnInit {

  defaultimgpath="./../../assets/admin.png";
  helper = new JwtHelperService();

loading = true;
  userId: any;
  Organisation: any;
  allIdeas: any;
  users: any;
  organisationDomain: any;
  profilePic: '';
  userName: string = '';
  IdeaStatement: string = '';
  img: string;
  efforts: string = '';
  budget: string = '';
  Description: string = '';
  created_on: string = '';
  updated_on: string = '';
  createDate: string[];
  updateDate: string = '';
  createTime: any;
  timeCreation: any;
  updateTime: any;
  updatedTime: any;
  created_by: any ;
  benefits: string = '';
  challenges: string = '';
  title: string = '';
  videoUrl: string = '';
  dateCreation: any;
  id: any;
  IdeaId: any;
  orgDomain: any;
  comments: any;
  userEmail: any;
  commentid: any;
  ideaid: any;
  SourceUser: string = '';
  alllikes: any;
  totalNumber: number;
  totalComments: number;
  userPic: any;
  isCurrentUserLiked: boolean;
  isCurrentUserDisliked: boolean;
  stars: number[] = [1, 2, 3, 4, 5];
  CommentMessage: string = '';
  CommentReplyMessage: string = '';
  PostMessage: string = '';
  like: any;
  likes: string;
  allunlikes: any;
  unlikeNumber: any;
  errorMessage: any;
  teams: any;
  skills: any;
  emailId: any;
  username: string;
  commentUserId: any;
  commentUserEmail: any;
  postComment: boolean = false;
  editComment: boolean = false;
  idComment: any;
  commentPic: any;
  slicedSkills: any;
  slicedTeams: any;
  categories: any;
  slicedCategories: any;
  unlike: any;
  organisationId: any;
  Idea: any;
  Ideaid: any;
  Ideadomain: any;
  LikeUserId: any;
  CommentId: any;
  CreateCommentComment: boolean = false;
  IdeaAttachments: any;
  idReplyComment: any;
  commentReplyId: any;
  CommentReplyEditMessage: string = '';
  editReplyComment: boolean = false;
  totalLikeNumber: any;
  totalUnikeNumber: any;
  totalCommentLikeNumber:any;
  totalCommentUnlikeNumber:any;
  isCurrentUserFollow : boolean = true;
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
  user: any;
  role: any;
  Status: any;
  needMyInput: boolean;
  follow: boolean = true;
  unFollow: boolean = false;
  finalVideoUrl: any ;

  @Output() ideaDelete = new EventEmitter();
  dislikeVisibility: boolean=true;
  fullName: any;
  totalCommentNumber: any;
  CommentunlikeNumber: any;
  totalTeams: any;
  totalCategories: any;
  totalSkills: any;
  totalAttachments: any;
  createdByEmail: any;
  idea: any;
  approver: any;
  moderator: any;
  admin: any;
  unlicensed: any;
  licensed: any;
  d_ellipsis: boolean;
  visibility: boolean;
  userRoles: any;
  title1: string;
  title2: string;
  Input: boolean;
  needInput: boolean;
  OrgDomain: any;

  constructor(
     private _ideaService: IdeaService,
     private _authservice:AuthService,
     private elementRef: ElementRef,
     public _userService: UserService,
     private _activatedRoute: ActivatedRoute,
     private _orgService: OrganisationService,
     private _route: Router,
     private modalService: NgbModal,
     private _toastr: ToastrService,
     private _sanitizer: DomSanitizer,
     @Inject(SUB_DOMAIN) private _subdomain: string

    ) 
    {
       this._ideaService.getUpdatedIdea().subscribe((res) => {
      this.GetIdeaById();
    });

    this._ideaService.listen().subscribe((m: any) => {

      this.GetIdeaById();
    });
    this._ideaService.onCommentEventTrigger.subscribe((key) => {
      this.GetComments();
    });
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.user =this._authservice.getUser();
    this.userId = this.user.id;
    this.role = this.user.Roles;
    this.userEmail = this.user.Email;
    this.userRoles = this.role.split("|");
    this.title1="Submit for Approval";
    this.title2="Add more Approver";
    this.approver= this.userRoles.includes("Approver");
    this.moderator =this.userRoles.includes("Moderator");
    this.admin =this.userRoles.includes("Admin");
    this.unlicensed =this.userRoles.includes("UnlicensedUser");
    this.licensed =this.userRoles.includes("licensedUser");

    this.getCurrentUser();

   if( this.userRoles.includes("UnlicensedUser"))
    {

      this.dislikeVisibility =false;
    }

    if(this.admin||this.moderator||this.approver)
    {
      this.d_ellipsis =true;
      if( this.admin||this.moderator)
      {
        this.visibility =true;
      }
    }

    this._orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.Organisation = res;
        this.organisationDomain =
        this.Organisation.organisations.organisationDomain;
        this.organisationId = this.Organisation.organisations.id;
        var localuser = new User();
        localuser.Id = this.userId;
        localuser.OrganisationDomain = this._subdomain;
        this._userService.getUserById(localuser).subscribe(
          (res) => {
            this.users = res;
            var firstName = this.users.users.firstName;
            var lastName = this.users.users.lastName;
            this.username = firstName + ' ' + lastName;
            if (this.users.users.userImage != null)
              this.userPic = this.users.users.userImage.imageSrc + '?' + Math.floor(1000000000 + Math.random() * 9000000000);

          },
          (err) => {}
        );
        this._ideaService.GetStatusCount(this._subdomain).subscribe(
          (res: StatusCount)=>{

            this.status = res;
          },
          (err:any) => {}
        );
      },
      (err) => {}
    );
    const id = this._activatedRoute.snapshot.queryParams.id;
    this.id = this._activatedRoute.snapshot.queryParams.id;
    this.IdeaId = this.id;

    const organisationDomain =
      this._activatedRoute.snapshot.queryParams.OrganisationDomain;
    this.organisationDomain =
      this._activatedRoute.snapshot.queryParams.OrganisationDomain;
    this.orgDomain = this._subdomain;
    var i = this._activatedRoute.snapshot.queryParams.input;
    if(i == "true"){
      this.Input = true;
    }
    else{
      this.Input = false;
    }
    
    this.GetIdeaById();

    this._ideaService.HashClickEvent.subscribe((e) => {
    });

    this._ideaService.AtTheClickEvent.subscribe((e) => {
      this._route.navigateByUrl(
        '/organisation/userdetail?id=' +
          e +
          '&OrganisationDomain=' +
          this._subdomain
      );
    });
  }

  ngAfterViewInit(): void {
    const me = this;
    let atThelinks =
      this.elementRef.nativeElement.querySelectorAll('.atthelink');
    let hashThelinks =
      this.elementRef.nativeElement.querySelectorAll('.hashlink');

    atThelinks.forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', this.handleAtTheClick);
    });
    hashThelinks.forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', this.handleHashClick);
    });
  }

  public handleAtTheClick = (event: Event) => {

    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    this._ideaService.AtTheLinkClicked(
      anchor.attributes.getNamedItem('data')?.value
    );
  };
  public handleHashClick = (event: Event) => {

    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    this._ideaService.HashLinkClicked(
      anchor.attributes.getNamedItem('data')?.value
    );
  };
  
  changeIdeaStatusTitle(type: any) {
    this._ideaService.ideaStatusTitle(type);
}

  GetIdeaById(){
    var value = {
      id: this.id,
      organisationDomain: this._subdomain,
    };
    this._ideaService.getIdeaById(value).subscribe(
      (res: any) => {
        this.Idea = res;

        var allIdeas = res;
        this.idea = allIdeas.ideas;

        this.totalLikeNumber = this.idea.ideaLikes ? this.idea.ideaLikes.length : 0;
        this.totalUnikeNumber = this.idea.ideaUnLikes ? this.idea.ideaUnLikes.length : 0;
        this.isCurrentUserLiked = allIdeas.ideas.isCurrentUserLiked;
        this.isCurrentUserDisliked = allIdeas.ideas.isCurrentUserDisliked;
        this.isCurrentUserFollow = allIdeas.ideas.isCurrentUserFollow;
        this.budget = allIdeas.ideas.budget;
        this.Status =allIdeas.ideas.status;
        this.categories = allIdeas.ideas.categories;
        this.totalCategories =allIdeas.ideas.categories.length;
        this.slicedCategories = this.categories.slice(0, 2);
        this.teams = allIdeas.ideas.ideaTeams;
        if(this.teams )
        {
          this.totalTeams= allIdeas.ideas.ideaTeams.length;
          this.slicedTeams = this.teams.slice(0, 2);
        }


        this.profilePic = allIdeas.ideas.createdBy.userImageUrl ? allIdeas.ideas.createdBy.userImageUrl : this.defaultimgpath;
        this.userName = allIdeas.ideas.userName;
        this.skills = allIdeas.ideas.skills;
        this.totalSkills=allIdeas.ideas.skills.length;
        this.slicedSkills = this.skills.slice(0, 2);
        this.efforts = allIdeas.ideas.efforts;
        this.videoUrl = allIdeas.ideas.videoUrl;
        if(this.videoUrl != null)
        {
          var substr = this.videoUrl.substring(this.videoUrl.length - 11, this.videoUrl.length);
          this.finalVideoUrl =  this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + substr + '?rel=0');
        }
        this.IdeaStatement = allIdeas.ideas.statement;
        this.Description = allIdeas.ideas.description;
        this.created_on = allIdeas.ideas.created_on;
        this.updated_on = allIdeas.ideas.updated_on;
        this.created_by = allIdeas.ideas.createdBy;

        var firstName = allIdeas.ideas.createdBy.firstName;
        var lastName = allIdeas.ideas.createdBy.lastName;
            this.fullName = firstName + ' ' + lastName;
        this.benefits = allIdeas.ideas.benefits;
        this.challenges = allIdeas.ideas.challenges;
        this.comments = allIdeas.ideas.comments;
        this.totalComments = this.comments.length;
        this.title = allIdeas.ideas.title;
        this.emailId = allIdeas.ideas.createdBy.emailId;
        let then = moment.utc(this.created_on).toDate();
        let now = moment(then).local().format('YYYY-MM-DDTHH:mm:ss');
        this.createDate = now.split('T');
         this.dateCreation = this.createDate[0];
         this.createTime = this.createDate[1].split('.');
         this.timeCreation = this.createTime[0];

        this.updateDate = allIdeas.ideas.updated_on.split('T');
        this.updateTime = this.updateDate[1].split('.');
        this.updatedTime = this.updateTime[0];
        if (allIdeas.ideas.ideaCoverImg) {
          this.img = allIdeas.ideas.ideaCoverImg.imageSrc + "?" + Math.floor(1000000000 + Math.random() * 9000000000);
        }
        if (allIdeas.ideas.ideaAttachments) {
          this.IdeaAttachments = allIdeas.ideas.ideaAttachments;
        }
        this.totalAttachments= allIdeas.ideas.ideaAttachments.length;

    this.approver= this.user.Roles.includes("Approver");
    this.moderator =this.user.Roles.includes("Moderator");
    this.admin =this.user.Roles.includes("Admin");
    this.unlicensed =this.user.Roles.includes("UnlicensedUser");
    this.licensed =this.user.Roles.includes("licensedUser");
    if(this.user.Roles =="UnlicensedUser" && this.Status==4 )
             {

               this.dislikeVisibility =false;
    }
    if(this.admin||this.moderator||this.approver)
    {
      this.d_ellipsis =true;
      if( this.admin||this.moderator)
      {
        this.visibility =true;
      }
    }
    this.loading = false;
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }

  GetComments(){
    var value = {
      id: this.IdeaId,
      organisationDomain: this.orgDomain,
    };
    this._ideaService.GetAllComments(value).subscribe(
      (res: any) => {
        this.comments = res;
        this.comments = this.comments.comments;
        this.totalComments = this.comments.length;


        var comments = this.comments.sort(
          (obj1: any, obj2: any) =>
            obj1.created_on.replaceAll(/[-' ':]/g, '') -
            obj2.created_on.replaceAll(/[-' ':]/g, '')
        );
        this.comments = comments.reverse();
      },
      (err: any) => {}
    );
  }

  followIdea(idea: any){
    this.unFollow = true;
    this.follow = false;
    var value = {
      IdeaId: idea.id,
      organisationDomain: idea.organisationDomain,

    };
    this._ideaService.CreateIdeaFollowUp(value).subscribe(
      (res) => {
        this._toastr.info('You start following this Idea', '', {
          timeOut: 3000,
        });
      }

    )
  }

  unFollowIdea(idea : any){
    this.follow = true;
    this.unFollow = false;
    this.isCurrentUserFollow = false;
    var value = {
      IdeaId: idea.id,
      organisationDomain: idea.organisationDomain,
    };
    this._ideaService.DeleteIdeaFollower(value).subscribe(
      (res) => {
        this._toastr.info('You UnFollow this Idea', '', {
          timeOut: 3000,
        });
      }

    )
  }

  getCurrentUser(){
    var localuser = new User();
    localuser.Id = this.userId;
    localuser.OrganisationDomain = this._subdomain;
    this._userService.getUserById(localuser).subscribe(
      (res) => {
        this.users = res;
        let roles = this.users.users.roles;
        if(roles.includes(3)){
          this.needMyInput = true;
        }
        else{
          this.needMyInput = false;
        }
      },
      (error) => { }
    );
  }

  ShowIdeaForm(formContent: any){
    this.modalService.open(formContent, { size: 'lg', backdrop: 'static' });
    this.Ideaid = this.id;
    this.Ideadomain = this.Idea.ideas.organisationDomain;
  }

  ShowPrivacyForm( formContent: any){
    this.Ideaid = this.id;
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  ShowApproverForm( formContent: any,title:any){
    this.Ideaid = this.id;
    this.title= (title == this.title1)?this.title1:this.title2;
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  DeleteIdea(id:string, status:any) {}

  rateStar(formContent: any){
    this.Idea = this.Idea;
     this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  sendIdeatoBackLog(idea: any, status: any){
    let formData = new FormData();
    formData.append('ideaId', idea.id);
    formData.append('organisationDomain', this._subdomain);
    formData.append('status', status);
    this._ideaService.changeIdeaStatus(formData).subscribe(
      (res) => {

        this._toastr.success('Status changed Successfully', '', {
          timeOut: 3000,
        });
        this._route.navigate(['/organisation/idea-main/recent-idea']);
        var value = {
          ideaStatus: status,
          ideaType: idea.status
        }
        this._ideaService.ideaCount(value);
      },
      (err) => {
        this._toastr.error('Status change Failed', '', {
          timeOut: 3000,
        });
      }
    );
  }

  changeIdeaStatus(status: any) {
    let formData = new FormData();
    formData.append('status', status);
    formData.append('ideaId', this.id);
    formData.append('organisationDomain', this._subdomain);
    this._ideaService.changeIdeaStatus(formData).subscribe(
      (res) => {

        this._toastr.success('Status changed Successfully', '', {
          timeOut: 3000,
        });
        this._route.navigate(['/organisation/idea-main/under-evaluation-idea']);
      },
      (err) => {
        this._toastr.error('Status change Failed', '', {
          timeOut: 3000,
        });
      }
    );
  }

  addLike(){
    var value = {
      ideaId: this.IdeaId,
      organisationDomain: this._subdomain,
    };
    this._ideaService.IdeaLike(value).subscribe(
      (res) => {

        this.like = res;
        if(this.like.message == "Like" || this.like.message == "DislikeRemovedLike"){
          this._toastr.info('You have Upvoted this Idea', '', {
            timeOut: 3000,
          });
        }
        else{
          this._toastr.info('You have removed Upvoted from this Idea', '', {
            timeOut: 3000,
          });
        }
        this.GetIdeaById();
        this._ideaService.notificationCount();
      },
      (err: any) => {}
    );
  }

  addUnlike() {
    var value = {
      ideaId: this.IdeaId,
      organisationDomain: this._subdomain,
    };

    this._ideaService.IdeaDislike(value).subscribe(
      (res) => {

        this.unlike = res;
        if(this.unlike.message == "Disike" || this.unlike.message == "LikeRemovedDislike"){
          this._toastr.info('You have Downvoted this Idea', '', {
            timeOut: 3000,
          });
        }
        else{
          this._toastr.info('You have removed Downvoted from this Idea', '', {
            timeOut: 3000,
          });
        }
        this.GetIdeaById();
        this._ideaService.notificationCount();
      },
      (err: any) => {}
    );
  }

  LikeModal(formContent: any, likeNo: any){
    
  }

  UnlikeModal(formContent: any, unlikeNo: any) {}

  TeamModal(formContent: any){}

  SkillModal(formContent: any){}

  CategoryModal(formContent: any) {}

  Post(){}

  ShowCommentForm(comment: any){}

  onDelete(comment: any){}

  onEdit(comment: any){}

  CommentLike(comment: any) {}

  ShowCommentLikeUser(comment: any, formContent: any) {}

  GetCommentLikesById(){}

  CommentUnlike(comment: any){}

  ShowCommentUnlikeUser(comment: any, formContent: any){}

  GetUnlikesById(){}

  GetCommentUnlikesById(){}

  CreateComment(comment: any) {}

  CommentComment(comment: any){}

  ShowReplyCommentForm(reply: any, replyCommentId: any){}

  ReplyDelete(e: any, replyCommentId: any){}

  onEditCommentReply(e: any, replyCommentId: any){}


}
