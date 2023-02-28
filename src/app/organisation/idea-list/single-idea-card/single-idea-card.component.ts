import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RoutesRecognized } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
//import { IdeaService } from 'src/app/shared/idea.service';
import { IdeaService } from 'src/app/services/idea.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import {Location, DatePipe} from '@angular/common';


@Component({
  selector: 'app-single-idea-card',
  templateUrl: './single-idea-card.component.html',
  styleUrls: ['./single-idea-card.component.css']
})
export class SingleIdeaCardComponent implements OnInit {
  helper = new JwtHelperService();

  userImage = './../../assets/admin.png';
  @Input('SpmEnabled') spmEnabled: boolean;
  @Input('IsMagicTokenValid') isMagicTokenValid: boolean;
  @Input('Index') index: number;
  @Input('Idea') idea: any;
  @Input('UserEmail') emailId: any;
  @Input('UserProfile') profilePic: any;
  @Input('UserId') userId: any;
  @Input('IdeaId') Ideaid: any;
  @Input('IdeaStatus') Ideastatus: any;
  @Input('IdeaDomain') Ideadomain: any;
  @Input('CommentId') CommentId: any;
  @Input('CreateCommentComment') CreateCommentComment: boolean;
  @Input('editComment') editComment: boolean = false;
  @Input('editReplyComment') editReplyComment: boolean = false;
  @Input('idComment') idComment: any;
  @Input('idReplyComment') idReplyComment: any;
  @Input('commentReplyId') commentReplyId: any;
  @Input('currentUser')currentUser:any;


  //@Input('ReplyCommentId') ReplyCommentId: any;

  @Output() onIdea = new EventEmitter();
  @Output() addIdeaLike = new EventEmitter();
  @Output() addIdeaDislike = new EventEmitter();
  @Output() addIdeaComment = new EventEmitter();
  @Output() addCommentLike = new EventEmitter();
  @Output() CommentLikeUserList = new EventEmitter();
  @Output() CommentUnlikeUserList = new EventEmitter();
  @Output() addCommentDislike = new EventEmitter();
  @Output() addCommentComment = new EventEmitter();
  @Output() ideaStatusChange = new EventEmitter();
  @Output() sendIdeaBackLog = new EventEmitter();
  @Output() ideaDelete = new EventEmitter();
  @Output() connectProject = new EventEmitter();
  @Output() deleteIdeaComment = new EventEmitter();
  @Output() editIdeaComment = new EventEmitter();
  @Output() editCommentReply = new EventEmitter();
  @Output() deleteCommentReply = new EventEmitter();
  @Output() addIdeaFollower = new EventEmitter();
  @Output() removeIdeaFollower = new EventEmitter();

  @ViewChild('postElement') postElement: ElementRef<HTMLDivElement> | undefined;
  panelOpenState = false;
  PostMessage: string = '';
  CommentMessage: string = '';
  ReplyCommentId: any;
  CommentReplyEditMessage: string = '';
  dislikeVisibility:boolean=true;
  Status: any;
  visibility: boolean=false;
  follow: boolean = true;
  unFollow: boolean = false;
  isCurrentUserFollow : boolean = true;
  Idea: any;
  stars: number[] = [1, 2, 3, 4, 5];
  d_ellipsis: boolean =false;
  approver: any;
  moderator: any;
  admin: any;
  unlicensed: any;
  licensed: any;
  userRoles: any;
  idea_profile_image: any;
  ideaCoverImage: any;
  title1:any;
  title2:any;
  title: any;
  createdByUserImage: any;
  createDate: string[];
  dateCreation: any;
  createTime: any;
  timeCreation: any;
  less: boolean =  true;
  more: boolean = false;
  ideastatus: string;
  finalVideoUrl: any;
  SpmProject: any;
  StartDate: any;
  FinishDate: any;
  date: Date;
  CosNodes: any;
  CosId: string;

  constructor(
    private _location: Location,
    private _authService: AuthService,
    private _ideaService: IdeaService,
    private _sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private _toastr: ToastrService,
    private datpipe: DatePipe,
    private _route: Router,
    private elementRef: ElementRef,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {}

  ngOnInit(): void {
    var i = this.spmEnabled;
    if(this.idea.videoUrl != null){
      var str = this.idea.videoUrl;
      var substr = str.substring(str.length - 11, str.length);
      this.finalVideoUrl =  this._sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.youtube.com/embed/' + substr + '?rel=0');
    }

    switch (this.idea.status) {
    case 0:
      this.ideastatus = "Draft"
      break;
    case 1:
      this.ideastatus = "Under Evaluation"
      break;
    case 2:
      this.ideastatus = "Under Approval"
      break;
    case 3:
      this.ideastatus = "Approved"
      break;
    case 4:
      this.ideastatus = "Fresh"
      break;
    case 6:
      this.ideastatus = "Backlog"
      break;
    default:
    }
    if(this.idea.createdBy)
   this.createdByUserImage = this.idea.createdBy.userImageUrl;
    if(this.createdByUserImage!= null)
    this.idea_profile_image = this.idea.createdBy.userImageUrl + '?' + Math.floor(1000000000 + Math.random() * 9000000000);
    if(this.idea.ideaCoverImg != null)
    this.ideaCoverImage = this.idea.ideaCoverImg.imageSrc + '?' + Math.floor(1000000000 + Math.random() * 9000000000);
    this.isCurrentUserFollow = this.idea.isCurrentUserFollow;
    this.Status =this.idea.status;
    let roles = this.currentUser.Roles;
    this.userRoles = roles.split("|");
    this.title1="Submit for Approval";
    this.title2="Add more Approver";
    this.approver= this.userRoles.includes("Approver");
    this.moderator =this.userRoles.includes("Moderator");
    this.admin =this.userRoles.includes("Admin");
    this.unlicensed =this.userRoles.includes("UnlicensedUser");
    this.licensed =this.userRoles.includes("licensedUser");


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
    let then = moment.utc(this.idea.created_on).toDate();
    let now = moment(then).local().format('YYYY-MM-DDTHH:mm:ss');
    this.createDate = now.split('T');
     this.dateCreation = this.createDate[0];
     this.createTime = this.createDate[1].split('.');
     this.timeCreation = this.createTime[0];
  }
  created_on(created_on: any) {
    throw new Error('Method not implemented.');
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

  onClick(idea: any) {
    this.onIdea.emit(idea);
  }

  ShowIdeaForm(idea: any, formContent: any, index: number) {
    this.modalService.open(formContent, { size: 'lg' });
    this.Ideaid = idea.id;
    this.Ideadomain = idea.organisationDomain;
  }

  ShowPrivacyForm(idea: any, formContent: any, index: number) {
    this.Ideaid = idea.id;
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  ShowCommentLikeUser(comment: any, formContent: any) {
    this.CommentId = comment.id;
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  ShowCommentUnlikeUser(comment: any, formContent: any) {
    this.CommentId = comment.id;
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  ShowApproverForm(idea: any, formContent: any,title:any, index: number) {

    this.Ideaid = idea.id;
    this.Ideastatus = idea.status;
    this.title= (title == this.title1)?this.title1:this.title2;
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  safeUrl() {


  }

  LikeModal(formContent: any) {
    if(this.idea.ideaLikes.length > 0)
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  UnlikeModal(formContent: any) {
    if(this.idea.ideaUnLikes.length > 0)
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  CommentModal(formContent: any) {
    if(this.idea.comments.length > 0)
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  CommentLikeModal(formContent: any) {
    if(this.idea.comments.commentLikes > 0)
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  CommentUnlikeModal(formContent: any) {
    if(this.idea.comments.commentUnlikes > 0)
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  OpenVideoModal(formContent: any) {
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  TeamModal(formContent: any) {
    if(this.idea.ideaTeams.length > 1)
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  SkillsModal(formContent: any) {
    if(this.idea.skills.length > 1)
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  CategoryModal(formContent: any) {
    if(this.idea.categories.length > 1)
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  InfoModal(formContent: any) {
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  CosNodeModal(formContent: any) {
    this.getCosNode();
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  ExportAttachment(formContent: any) {
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  changeCosNode(event: Event){
    this.CosId = (<HTMLInputElement>event.target).value;
    console.log(this.CosId);
  }

  GetProjectDesp(formContent: any, ideaId: string) {
      var magicToken = this._authService.getMagicToken();
      var value = {
        IdeaId : ideaId,
        MagicToken : magicToken,
        OrganisationDomain : this._subdomain
      }

        this._ideaService.getSpmProject(value).subscribe(
          (res: any) => {
            this.SpmProject = res.data[0];
            console.log(this.SpmProject);
            if(this.SpmProject){
              this._toastr.success('Project not found.', '', {
                timeOut: 3000,
              });
            }
            else{
              console.log(this.SpmProject);
              this.StartDate = this.datpipe.transform(this.SpmProject.StartDate, "dd/MM/yyyy");
              this.FinishDate = this.datpipe.transform(this.SpmProject.FinishDate, "dd/MM/yyyy");
              this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
            }
          },
          (err: any) => {
          }
        );
  }

  addLike(idea: any, index: number) {
    this.addIdeaLike.emit({ idea, index });
  }

 followIdea(idea: any){
  this.unFollow = true;
  this.follow = false;
  this.addIdeaFollower.emit(idea);
 }

 unFollowIdea(idea : any){
  this.follow = true;
  this.unFollow = false;
  this.isCurrentUserFollow = false;
  this.removeIdeaFollower.emit(idea);
}

  addUnlike(idea: any, index: number) {
    this.addIdeaDislike.emit({ idea, index });
  }

  Post(idea: any, index: number) {

    let PostMessage = this.PostMessage;
    this.addIdeaComment.emit({ idea, PostMessage, index });
  }

  CreateComment(comment: any) {
    this.CommentId = comment.id;
    this.CreateCommentComment = true;
  }

  CommentLikeUsers(comment: any) {
    this.CommentId = comment.id;
    this.CommentLikeUserList.emit(comment);
  }

  CommentUnlikeUsers(comment: any) {
    this.CommentId = comment.id;
    this.CommentUnlikeUserList.emit(comment);
  }

  CommentComment(comment: any, index: number) {
    let CommentMessage = this.CommentMessage;
    this.addCommentComment.emit({ comment, CommentMessage, index });
  }

  CommentLike(comment: any, index: number) {

    this.addCommentLike.emit({ comment, index });
  }

  CommentUnlike(comment: any, index: number) {
    this.addCommentDislike.emit({ comment, index });
  }

  changeIdeaStatus(idea: any, status: any, index: number) {
    this.ideaStatusChange.emit({ idea, status, index });
  }

  sendIdeatoBackLog(idea: any, status: any, index: number) {
    this.sendIdeaBackLog.emit({ idea, status, index });
  }

  onDelete(comment: any, index: number) {
    this.deleteIdeaComment.emit({ comment, index });
  }

  ShowCommentForm(comment: any) {
    this.idComment = comment.id;
    this.CommentMessage = comment.message;
    this.editComment = true;
  }

  ShowReplyCommentForm(reply: any, replyCommentId: any) {
    this.idReplyComment = reply.id;
    this.commentReplyId = replyCommentId;
    this.CommentReplyEditMessage = reply.message;
    this.editReplyComment = true;
  }

  onEditCommentReply(
    reply: any,
    replyCommentId: any,
    ideaId: any,
    index: number
  ) {
    let CommentReplyEditMessage = this.CommentReplyEditMessage;
    this.editCommentReply.emit({
      reply,
      replyCommentId,
      CommentReplyEditMessage,
      ideaId,
      index,
    });
  }

  onEdit(comment: any, index: number) {
    let CommentMessage = this.CommentMessage;
    this.editIdeaComment.emit({ comment, CommentMessage, index });
  }

  ReplyDelete(reply: any, replyCommentId: any, idea: any, index: number) {
    this.deleteCommentReply.emit({ reply, replyCommentId, idea, index });
  }

  DeleteIdea(idea: any,index:number) {
    this.ideaDelete.emit({idea,index});
  }

  rateStar(formContent: any,idea: any, index: number) {

   // this.Ideaid = idea.id;
    this.Idea=idea;
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  UserProfile(id: string) {
    this._ideaService.ideaStatusTitle('My Profile');
    this._route.navigate(['/organisation/userdetail', id]);
  }

  seemore(){
    this.more = true;
    this.less = false;
  }

  seeless(){
    this.less = true;
    this.more = false;
  }

  connectToProject(idea: any,index:number) {
    let cosId = this.CosId;
    this.connectProject.emit({idea,index,cosId});
  }

  goToSpm(){
    this._route.navigate(['organisation/spm', this.SpmProject.ProjectID, this.SpmProject.Type ]);
    this.modalService.dismissAll();
  }

  getCosNode(){
    let magicToken = window.sessionStorage.getItem('magic-token');
    console.log(magicToken);
    var value = {
      MagicToken : magicToken,
    }

      this._ideaService.getCosNode(value).subscribe(
        (res: any) => {
          this.CosNodes = res;
          if(this.CosNodes != null){
            this.CosNodes = this.CosNodes.filter((node: { Level: number; }) => node.Level == 1);
            console.log(this.CosNodes);
          }
        },
        (err: any) => {
        }
      );
  }

}
