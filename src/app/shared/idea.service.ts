import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { idea } from './idea.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Team } from './team.model';
import { Category } from './category.model';
import { Tag } from './tag.model';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class IdeaService {
  ideas: idea = {
    id: '',
    idea: '',
    title: '',
    statement: '',
    description: '',
    efforts: '',
    budget: '',
    tags: '',
    code: '',
    skills: [],
    categories: [],
    benefits: '',
    challenges: '',
    teams: [],
    attachment: '',
    imageDataBase64: '',
    videoUrl: '',
    organisationDomain: '',
    orgId: '',
    status: 0,
  };

  onIdeaCreate: EventEmitter<any> = new EventEmitter();
  onIdeaEdit: EventEmitter<any> = new EventEmitter();
  //onLike:EventEmitter<any> = new EventEmitter();

  postEvent: EventEmitter<any> = new EventEmitter();
  HashClickEvent: EventEmitter<any> = new EventEmitter();
  AtTheClickEvent: EventEmitter<any> = new EventEmitter();

  onEventTrigger: EventEmitter<any> = new EventEmitter();
  onCommentEventTrigger: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private _router: Router) {}

  private _listeners = new Subject<any>();
  private _listenerskey = new Subject<any>();

  listen(): Observable<any> {
    return this._listeners.asObservable();
  }

  listenkey(): Observable<any> {
    return this._listenerskey.asObservable();
  }

  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

  filterIdea(key: string) {
    this._listenerskey.next(key);
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

  getJustApprovedIdeas(value:any
    ){
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetJustApprovedIdeas?OrganisationDomain='+ value.organisationDomain +
      '&Status='+
      3
    );
  }
  getRecentIdeas(value:any
    ){
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetRecentlyChangedIdeas?OrganisationDomain='+ value.organisationDomain 
     
    );
  }

  //by shivangi
  GetIdeasByStatus(value:any){
    return this.http.get(
      environment.apiIdeaUrl +
      'IdeaService/GetIdeasByStatus?OrganisationDomain='+ value.organisationDomain + '&ideastatus=' + value.ideastatus
     
    );
  }

  getIdeaById(value: any) {
    return this.http.get(
      environment.apiIdeaUrl +
        'IdeaService/GetIdeaById?Id=' +
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
        value.commentId +
        '&OrganisationDomain=' +
        value.organisationDomain
    );
  }

  GetCommentUnlikeById(value: any) {
    return this.http.get(
      environment.apiIdeaUrl +
        'IdeaService/GetCommentUnlikeById?CommentId=' +
        value.commentId +
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
  GetStatusCount(value: any) {
    return this.http.get(
      environment.apiIdeaUrl +
        'IdeaService/GetStatusCount?OrganisationDomain=' +
        value
    );
  }
}
