import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Attachment } from '../models/attachment-model';
import { Idea } from '../models/idea-model';
import { StatusCount } from '../models/StatusCount-model';

@Injectable({
  providedIn: 'root',
})
export class IdeaService {

  onIdeaCreate: EventEmitter<any> = new EventEmitter();
  onIdeaPublish: EventEmitter<any> = new EventEmitter();

  onIdeaEdit: EventEmitter<any> = new EventEmitter();
  //onLike:EventEmitter<any> = new EventEmitter();

  postEvent: EventEmitter<any> = new EventEmitter();
  HashClickEvent: EventEmitter<any> = new EventEmitter();
  AtTheClickEvent: EventEmitter<any> = new EventEmitter();

  onEventTrigger: EventEmitter<any> = new EventEmitter();
  onCommentEventTrigger: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private _router: Router) { }

  private _listeners = new Subject<any>();
  private _listenersOnIdeaCreate = new Subject<any>();
  private _listenersOnIdeaUpdate = new Subject<any>();
  private _listenersApproverAdded = new Subject<any>();
  private _listenersOnIdeaUpdateEvent = new Subject<any>();
  private _listenersIdeaCount = new Subject<any>();
  private _listenersSingleIdeaNotification = new Subject<any>();
 private _listenersOnIdeaRecentlyUpdate = new Subject<any>();
 private _listenersOnIdeaByEmail= new Subject<any>();
 private _listenersOnIdeaApproved= new Subject<any>();
  private _listenerskey = new Subject<any>();
  private _listenersIdeaDeleted = new Subject<any>();

  listen(): Observable<any> {
    return this._listenersSingleIdeaNotification.asObservable();
  }

  getIdeaCount(): Observable<any> {
    return this._listenersIdeaCount.asObservable();
  }

  getNotificationCount(): Observable<any> {
    return this._listeners.asObservable();
  }

  GetIdeasStatusTitle() : Observable<any> {
    return this._listeners.asObservable();
  }

  getUpdatedIdea() : Observable<any> {

    return this._listenersOnIdeaUpdate.asObservable();
  }

  getApproverAdded(): Observable<any> {

    return this._listenersApproverAdded.asObservable();
  }



  getUpdatedIdeaEvent() : Observable<any> {

    return this._listenersOnIdeaUpdateEvent.asObservable();
  }


  onNewIdeaCreate() : Observable<any> {
    return this._listenersOnIdeaCreate.asObservable();
  }

  listenkey(): Observable<any> {
    return this._listenerskey.asObservable();
  }

  listenIdeaDeleted():Observable<any>{
  return this._listenersIdeaDeleted.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

  filterByUserId(Id:string)
  {
    this._listenersOnIdeaByEmail.next(Id);
  }

  getIdeaByUserId():Observable<any>{
    return this._listenersOnIdeaByEmail.asObservable();
  }
  filterIdea(key: string) {

    this._listenerskey.next(key);
  }

  ideaCount(status: any) {
    this._listenersIdeaCount.next(status);
  }
  IdeaNotExists(Id:any)
  {
    this._listenersIdeaDeleted.next(Id);
  }

  ideaCreate(idea:any){
    this._listenersOnIdeaCreate.next(idea);
  }

  ideaUpdate(ideaId: string, index: number){

    var value = {
      ideaId: ideaId,
      index: index
    }
    this._listenersOnIdeaUpdate.next(value);
  }

  approverAdded(ideaId: string, index: number){

    var value = {
      ideaId: ideaId,
      index: index
    }
    this._listenersApproverAdded.next(value);
  }

  ideaUpdateEvent(ideaId: string, index: number, statuschange: boolean){

    var value = {
      ideaId: ideaId,
      index: index,
      statuschange : statuschange
    }
    this._listenersOnIdeaUpdateEvent.next(value);
  }

  ideaRecentlyUpdated(ideaId: string){
    this._listenersOnIdeaRecentlyUpdate.next(ideaId);
  }

  getRecentUpdatedIdea(): Observable<any>{

    return this._listenersOnIdeaRecentlyUpdate.asObservable();
  }
  notificationCount() {
    this._listenersSingleIdeaNotification.next();
  }

  ideaApproved(ideaId:string) {

    this._listenersOnIdeaApproved.next(ideaId);
  }

  getApprovedIdea() : Observable<any> {
  return this._listenersOnIdeaApproved.asObservable();
}
  ideaStatusTitle(title: string){
    this._listeners.next(title);
    const statusTitle = title;
        localStorage.setItem('idea-status-title', JSON.stringify(statusTitle));
  }

  deleteAttachment(attachment: Attachment) {
    return this.http.delete(
      environment.apiIdeaUrl +
      'IdeaService/DeleteAttachment/' +
      attachment.AttachmentId +
      '?Id=' +
      attachment.AttachmentId +
      '&OrganisationDomain=' +
      attachment.OrganidationDomain
    );
  }

  PushIdeaToSpm(value: any){
    return this.http.post(environment.apiIdeaUrl + 'IdeaService/PushIdeaToSpm' , value
    );
  }

  getSpmProject(value: any){
    return this.http.get(environment.apiIdeaUrl + 'IdeaService/GetProject?IdeaId='+ value.IdeaId + '&MagicToken=' + value.MagicToken + '&OrganisationDomain=' + value.OrganisationDomain
    );
  }

  getCosNode(value: any){
    return this.http.get(environment.apiIdeaUrl + 'IdeaService/GetCosNode?MagicToken=' + value.MagicToken
    );
  }



  deleteTeam(team: any) {
    return this.http.delete(
      environment.apiIdeaUrl +
      'IdeaService/DeleteIdeaTeam/' +
      team.Id +
      '?TeamId=' +
      team.Id +
      '&IdeaId=' +
      team.IdeaId +
      '&OrganisationDomain=' +
      team.organidationDomain
    );
  }

  deleteIdeaPublishedUser(value: any) {
    return this.http.delete(
      environment.apiIdeaUrl +
      'IdeaService/DeleteIdeaPublishedUser/' +
      value.Id +
      '?Id=' +
      value.Id +
      '&OrganisationDomain=' +
      value.OrganidationDomain +
      '&IdeaId=' +
      value.IdeaId
    );
  }
  deleteIdeaApprover(value: any) {
    return this.http.delete(
      environment.apiIdeaUrl +
      'IdeaService/DeleteIdeaApprover/' +
      value.Id +
      '?Id=' +
      value.Id +
      '&OrganisationDomain=' +
      value.OrganidationDomain +
      '&IdeaId=' +
      value.IdeaId
    );
  }


  getAllIdea(domain: any) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetAllIdea?OrganisationDomain=' +
      domain
    );
  }

  getIdeawithKey(value: any) {

    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetIdeaWithKey?OrganisationDomain=' +
      value.organisationDomain +
      '&SkillKey=' +
      value.skillKey
    );
  }

  //by shivangi
  GetIdeasByStatus(value: any) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetIdeasByStatus?OrganisationDomain=' + value.organisationDomain + '&ideastatus=' + value.ideastatus

    );
  }

  //by shweta chauhan
  GetRecentIdeas(value: any) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetRecentIdea?OrganisationDomain=' + value

    );
  }

  //ByShivangi
  GetIdeasForApprovers(value: any) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetIdeasForApprovers?OrganisationDomain=' + value

    );
  }

  GetStatusCount(domain: string): Observable<StatusCount> {
    return this.http.get<StatusCount>(environment.apiIdeaUrl +
      'IdeaService/GetStatusCount?OrganisationDomain=' +
      domain);
  }

  // getRefreshIdea(value:any){

  //   return this.http.get(
  //     environment.apiIdeaUrl +
  //     'IdeaService/RefreshIdea?OrganisationDomain=' + value.organisationDomain + '&Id=' +   value.id
  //   );

  //   }

  getIdeaById(value: any) {

    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetIdeaById?Id=' +
      value.id +
      '&OrganisationDomain=' +
      value.organisationDomain
    );
  }
  RefreshIdea(value: any) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/RefreshIdea?Id=' +
      value.id +
      '&OrganisationDomain=' +
      value.organisationDomain
    );
  }


  updateIdea(value: any) {
    return this.http.put(
      environment.apiIdeaUrl + 'IdeaService/UpdateIdea',
      value
    );
  }

  // deleteIdea(idea:any){
  //   return this.http.delete (environment.apiIdeaUrl + 'AccountService/DeleteIdea',idea);
  // }

  getJustApprovedIdeas(value: any
  ) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetJustApprovedIdeas?OrganisationDomain=' + value.organisationDomain +
      '&Status=' +
      3
    );
  }
  getRecentlyChangedIdeas(value: any
  ) {

    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetRecentlyChangedIdeas?OrganisationDomain=' + value

    );
  }
  getTopVotedIdeas(value: any) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetTopVotedIdeas?OrganisationDomain=' + value
    );

  }
  deleteIdea(idea: any) {

    return this.http.delete(
      environment.apiIdeaUrl +
      'IdeaService/DeleteIdea/' +
      idea.id +
      '?Id=' +
      idea.id +
      '&OrganisationDomain=' +
      idea.organisationDomain
    );
  }

  updateComment(value: any) {
    return this.http.put(
      environment.apiIdeaUrl + 'IdeaService/UpdateComment',
      value
    );
  }

  updateCommentComment(value: any) {
    return this.http.put(
      environment.apiIdeaUrl + 'IdeaService/UpdateCommentComment',
      value
    );
  }

  deleteComment(value: any) {
    return this.http.delete(
      environment.apiIdeaUrl +
      'IdeaService/DeleteComment/' +
      value.id +
      '?Id=' +
      value.id +
      '&OrganisationDomain=' +
      value.organisationDomain +
      '&IdeaId=' +
      value.ideaId
    );
  }

  deleteCommentComment(value: any) {
    return this.http.delete(
      environment.apiIdeaUrl +
      'IdeaService/DeleteCommentComment/' +
      value.id +
      '?Id=' +
      value.id +
      '&OrganisationDomain=' +
      value.organisationDomain +
      '&CommentId=' +
      value.commentId
    );
  }

  createIdea(idea: any) {
    return this.http.post(
      environment.apiIdeaUrl + 'IdeaService/CreateIdea',
      idea
    );
  }

  GetAllComments(value: any) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetAllComments?Id=' +
      value.id +
      '&OrganisationDomain=' +
      value.organisationDomain
    );
  }

  GetCommentLikeById(value: any) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetCommentLikeById?CommentId=' +
      value.CommentId +
      '&OrganisationDomain=' +
      value.organisationDomain
    );
  }

  GetCommentUnlikeById(value: any) {

    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetCommentUnlikeById?CommentId=' +
      value.CommentId +
      '&OrganisationDomain=' +
      value.organisationDomain
    );
  }

  createComment(value: any) {
    return this.http.post(
      environment.apiIdeaUrl + 'IdeaService/CreateComment',
      value
    );
  }

  addUnlike(value: any) {
    return this.http.post(
      environment.apiIdeaUrl + 'IdeaService/AddUnlike',
      value
    );
  }

  addLike(value: any) {
    return this.http.post(
      environment.apiIdeaUrl + 'IdeaService/Addlike',
      value
    );
  }

  IdeaLike(value: { ideaId: any; organisationDomain: any; }) {
    return this.http.post(
      environment.apiIdeaUrl + 'IdeaService/IdeaLike',
      value
    );
  }

  IdeaDislike(value: { ideaId: any; organisationDomain: any; }) {
    return this.http.post(
      environment.apiIdeaUrl + 'IdeaService/IdeaDislike',
      value
    );
  }

  GetLikesByIdeaId(like: any) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetLikeByIdeaId?IdeaId=' +
      like.IdeaId +
      '&OrganisationDomain=' +
      like.organisationDomain
    );
  }

  GetUnlikesByIdeaId(unlike: any) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetUnlikeByIdeaId?IdeaId=' +
      unlike.IdeaId +
      '&OrganisationDomain=' +
      unlike.organisationDomain
    );
  }
  // getLikes(predicate:string)
  // {
  //   return this.http.get(
  //     environment.apiIdeaUrl +'IdeaService/likes/' + '?=' +predicate )
  // }
  addCommentComment(value: any) {
    return this.http.post(
      environment.apiIdeaUrl + 'IdeaService/CreateCommentComment',
      value
    );
  }

  addCommentLike(value: any) {
    return this.http.post(
      environment.apiIdeaUrl + 'IdeaService/AddCommentLike',
      value
    );
  }

  addCommentUnlike(value: any) {
    return this.http.post(
      environment.apiIdeaUrl + 'IdeaService/AddCommentUnlike',
      value
    );
  }

  CreatePublishedUser(value: any) {
    return this.http.post(
      environment.apiIdeaUrl + 'IdeaService/CreatePublishedUser',
      value
    );
  }

  CreateIdeaFollowUp(value: any) {

    return this.http.post(
      environment.apiIdeaUrl + 'IdeaService/CreateIdeaFollowUp',
      value
    );
  }

  recievePost(post: any) {
    this.postEvent.emit(post);
  }
  HashLinkClicked(val: any) {
    this.HashClickEvent.emit(val);
  }
  AtTheLinkClicked(val: any) {
    this.AtTheClickEvent.emit(val);
  }

  getIdeasByUserId(value: any) {
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/getIdeaByUserId?OrganisationDomain=' +
      value.organisationDomain +
      '&Id=' +
      value.id
    );

  }

  publishIdea(value: any) {
    return this.http.put(
      environment.apiIdeaUrl + 'IdeaService/PublishIdea',
      value
    );
  }

  ApproveIdea(value: any) {
    return this.http.put(
      environment.apiIdeaUrl + 'IdeaService/ApproveIdea',
      value
    );
  }

  DeleteIdeaFollower(value:any){
    return this.http.delete(
      environment.apiIdeaUrl + 'IdeaService/DeleteIdeaFollowers?IdeaId=' +
      value.IdeaId +
      '&OrganisationDomain=' +
      value.organisationDomain
    );
  }

  changeIdeaStatus(value: any) {
    return this.http.put(
      environment.apiIdeaUrl + 'IdeaService/ChangeIdeaStatus',
      value
    );
  }
  GetIdeaApprover(value:any)
  { return this.http.get(
    environment.apiIdeaUrl + 'IdeaService/GetIdeasApprovers?IdeaId=' +
    value.IdeaId +
    '&OrganisationDomain=' +
    value.organisationDomain
  );

  }
}

