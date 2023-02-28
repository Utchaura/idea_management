import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { IdeaService } from 'src/app/shared/idea.service';
import { IdeaService } from 'src/app/services/idea.service';

@Component({
  selector: 'app-single-idea',
  templateUrl: './single-idea.component.html',
  styleUrls: ['./single-idea.component.css'],
})
export class SingleIdeaComponent implements OnInit, AfterViewInit {
  helper = new JwtHelperService();

  userImage = './../../assets/admin.png';
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
  @Output() deleteIdeaComment = new EventEmitter();
  @Output() editIdeaComment = new EventEmitter();
  @Output() editCommentReply = new EventEmitter();
  @Output() deleteCommentReply = new EventEmitter();
  @Output() addIdeaFollower = new EventEmitter();
  @Output() removeIdeaFollower = new EventEmitter();

  @ViewChild('postElement') postElement: ElementRef<HTMLDivElement> | undefined;

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
  finalVideoUrl: any;

  constructor(
    private _ideaService: IdeaService,
    private _sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {

    if(this.idea.videoUrl != null){
      var str = this.idea.videoUrl;
      var substr = str.substring(str.length - 11, str.length);
      this.finalVideoUrl =  this._sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.youtube.com/embed/' + substr + '?rel=0');
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

  ShowPrivacyForm(idea: any, formContent: any) {
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

  ShowApproverForm(idea: any, formContent: any,title:any) {

    this.Ideaid = idea.id;
    this.Ideastatus = idea.status;
    this.title= (title == this.title1)?this.title1:this.title2;
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }


  LikeModal(formContent: any) {

    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  UnlikeModal(formContent: any) {
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
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

  changeIdeaStatus(idea: any, status: any) {
    this.ideaStatusChange.emit({ idea, status });
  }

  sendIdeatoBackLog(idea: any, status: any) {
    this.sendIdeaBackLog.emit({ idea, status });
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

  rateStar(formContent: any,idea: any,) {

   // this.Ideaid = idea.id;
    this.Idea=idea;
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }
}
