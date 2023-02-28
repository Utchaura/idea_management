import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user-model';
import { IdeaService } from 'src/app/services/idea.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';
import { HubConnection } from '@microsoft/signalr';
import { AuthService } from 'src/app/services/auth.service';
import { StatusCount } from 'src/app/models/StatusCount-model';
import { EventManagementService } from 'src/app/services/event-management.service';
import { filter, pairwise } from 'rxjs/operators';
@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.component.html',
  styleUrls: ['./idea-list.component.css'],
})
export class IdeaListComponent implements OnInit {
  @Input() public idea_status: number;
  @Input() public CurrentUserIdea: string;
  @Input() public idea_state: number;
  @Input() public idea_stat: number;
  @Input() public idea_user: any;
  @Input() public idea_email: any;
  @Input() public idea_input: any;
  @Input() public input_idea: any;
  @Input() public idea_approval: any;
  @Input() public recent_idea: string = null;

  filterKeyValue: string = '';
  showInputSearch: boolean = false;
  spmEnabled: boolean = false;
  isMagicTokenValid: boolean = false;
  loading = false;
  posts: any[] = [];
  filterIdeaKey: string;
  ideas: any;
  organisation: any;
  organisationDomain: any;
  organisationId: any;
  helper = new JwtHelperService();
  Organisation: any;
  allIdeas: any;
  userId: any;
  users: any;
  profilePic: any;
  userName: string = '';
  Ideaid: any;
  orgDomain: any;
  like: any;
  unlike: any;
  alllikes: any;
  totalNumber: number;
  errorMessage: any;
  emailId: any;
  idIdea: any;
  postComment: boolean = false;
  PostMessage: string = '';
  CommentReplyEditMessage: string = '';
  index: any;
  Ideadomain: any;
  CreateCommentComment: boolean = false;
  isCurrentUserLiked: boolean = false;
  isCurrentUserDisliked: boolean = false;
  isCurrentCommentLiked: boolean = false;
  isCurrentCommentDisliked: boolean = false;
  comments: any;
  CommentId: any;
  CommentReplyId: any;
  commentReplyId: any;
  commentcomment: any;
  CommentMessage: string = '';
  userList: any;
  tagteam: any;
  editComment: boolean = false;
  editReplyComment: boolean = false;
  idComment: any;
  idReplyComment: any;
  commentUserEmail: any;
  CommentLikeUserList: any;
  CommentUnlikeUserList: any;
  data: any;
  refreshideaId: any;
  currentUser: any;
  approverideas: any;
  useremail: any;
  IdeaStatus: string;
  userEmail: any;
  Id: any;
  filterUserId: any;
  ideaList: any;
  copyIdeas: any;
  filter: boolean = false;
  currentUserIsApprover: boolean;
  ideaListInNeedMyInput: any;
  windowUrl: string;
  localUrl: string;
  prodUrl: string;
  status: StatusCount = {
    status: {
      draft: 0,
      approved: 0,
      publish: 0,
      underApproval: 0,
      open: 0,
      approver: 0,
      backlog: 0,
    },
  };
  allIdeaLength: any;
  filterByUser: string;
  idea: any;
  flag: boolean;
  SpmIntegrationCount: any;
  SpmIdea: any;
  approvedIdeaCount: any;
  pUrl: string;
  BackUrl: string;

  @ViewChild('search') search: ElementRef;
  previousUrl: string;

  constructor(
    private route: ActivatedRoute,
    private _ideaService: IdeaService,
    private _sanitizer: DomSanitizer,
    public _userService: UserService,
    private _orgService: OrganisationService,
    private modalService: NgbModal,
    private _route: Router,
    private _toastr: ToastrService,
    private http: HttpClient,
    public _authservice: AuthService,
    private _eventManagement: EventManagementService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {
    _route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.previousUrl = event.url;
      });
    // this._ideaService.listenkey().subscribe((key: any) => {
    //   this.filterIdeaKey = key;
    // });

    this._ideaService.getIdeaCount().subscribe((status) => {
      const s = status;
      localStorage.setItem('idea-status', JSON.stringify(s));
      if (status.ideaType == 9) {
        if (status.ideaStatus == 0) {
          this.status.status.draft = this.status.status.draft - 1;
        }
        if (status.ideaStatus == 1) {
          this.status.status.open = this.status.status.open - 1;
        }
        if (status.ideaStatus == 2) {
          this.status.status.underApproval =
            this.status.status.underApproval - 1;
          this.status.status.approver = this.status.status.approver - 1;
        }
        if (status.ideaStatus == 4) {
          this.status.status.publish = this.status.status.publish - 1;
        }
      } else {
        if (status.ideaStatus == 0) {
          this.status.status.draft = this.status.status.draft + 1;
        }
        if (status.ideaStatus == 4) {
          if (status.ideaType == 0) {
            this.status.status.draft = this.status.status.draft - 1;
            this.status.status.publish = this.status.status.publish + 1;
          }
          if (status.ideaType == 4) {
          }
        }
        if (status.ideaStatus == 3) {
          this.status.status.underApproval =
            this.status.status.underApproval - 1;
          this.status.status.approver = this.status.status.approver - 1;
          this.status.status.approved = this.status.status.approved + 1;
          this.approvedIdeaCount = this.approvedIdeaCount + 1;
        }
        if (status.ideaStatus == 6) {
          if (status.ideaType == 6) {
          } else {
            this.status.status.underApproval =
              this.status.status.underApproval - 1;
            this.status.status.approver = this.status.status.approver - 1;
            this.status.status.backlog = this.status.status.backlog + 1;
          }
        }
        if (status.ideaStatus == 1) {
          if (status.ideaType == 1) {
          }
          if (status.ideaType == 1.1) {
            this.status.status.approver = this.status.status.approver - 1;
            this.status.status.underApproval =
              this.status.status.underApproval - 1;
            this.status.status.open = this.status.status.open + 1;
          }
          if (status.ideaType == 2) {
            this.status.status.underApproval =
              this.status.status.underApproval - 1;
            this.status.status.open = this.status.status.open + 1;
          }
          if (status.ideaType == 4) {
            this.status.status.publish = this.status.status.publish - 1;
            this.status.status.open = this.status.status.open + 1;
          }
          if (status.ideaType == 6) {
            this.status.status.backlog = this.status.status.backlog - 1;
            this.status.status.open = this.status.status.open + 1;
          }
        }

        if (status.ideaStatus == 2) {
          if (status.ideaType == 1) {
            this.status.status.open = this.status.status.open - 1;
            this.status.status.underApproval =
              this.status.status.underApproval + 1;
          }
          if (status.ideaType == 2) {
          }
          if (status.ideaType == 4) {
            this.status.status.publish = this.status.status.publish - 1;
            this.status.status.underApproval =
              this.status.status.underApproval + 1;
          }
        }
        if (status.ideaStatus == 'needmyInput' && status.ideaType == 2) {
        }
        if (status.ideaStatus == 2.5) {
          if (status.ideaType == 1) {
            this.status.status.open = this.status.status.open - 1;
            this.status.status.underApproval =
              this.status.status.underApproval + 1;
            this.status.status.approver = this.status.status.approver + 1;
          }

          if (status.ideaType == 2) {
            this.status.status.approver = this.status.status.approver;
          }

          if (status.ideaType == 4) {
            this.status.status.publish = this.status.status.publish - 1;
            this.status.status.underApproval =
              this.status.status.underApproval + 1;
            this.status.status.approver = this.status.status.approver + 1;
          }
        }
      }
    });

    this._ideaService.getUpdatedIdeaEvent().subscribe((res) => {
      let idea = res;
      if (this.filter) this.ideaList.splice(idea.index, 1);
      else this.ideas.splice(idea.index, 1);
    });
    this._ideaService.getUpdatedIdea().subscribe((res) => {
      let idea = res;
      if (this.flag) {
        this.GetIdeaById(idea.ideaId, idea.index);
      } else if (!this.flag) {
        if (this.filter) this.ideaList.splice(idea.index, 1);
        else this.ideas.splice(idea.index, 1);
      } else {
      }
    });
  }

  ngOnInit(): void {
    var flag = this.route.snapshot.paramMap.get('redirection');
    if (flag) {
      let curr: HTMLElement = document.getElementById('btn-click' ) as HTMLElement;
      curr.click();
      curr.className = curr.className + " " + ('active');
      let current: HTMLElement = document.getElementsByClassName('active')[0] as HTMLElement;;
      current.className = current.className.replace(" active", "");
      this.getSpmIntegratedIdea();
    }
    else{
      this.needForApproval();
    }
    this._eventManagement.ideaStatusChange.subscribe((data) => {
      if (this.filter) {
        this.ideaList.splice(data.index, 1);
        this.ideas.splice(data.index, 1);
      }
    });
    if (this._authservice.getMagicToken()) this.isMagicTokenValid = true;
    this.windowUrl = window.location.href;
    this.localUrl =
      'http://' +
      this._subdomain +
      '.poideamanagement.com:4200/organisation/idea-list';
    this.prodUrl =
      'http://' + this._subdomain + '.ideashub.io/organisation/idea-list';
    const user = this._authservice.getUser();
    this.userId = user.id;
    this.emailId = user.Email;
    this.currentUser = user;

    this._orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.organisation = res;
        this.organisationDomain =
          this.organisation.organisations.organisationDomain;
        this.organisationId = this.organisation.organisations.id;
        this.getCurrentUser();

        this._ideaService.getAllIdea(this._subdomain).subscribe(
          (res: any) => {
            var response = res;
            response = response.ideas;
            this.allIdeaLength = response ? response.length : 0;
          },
          (error: any) => {}
        );
        var value = {
          organisationDomain: this._subdomain,
          ideastatus: 3,
        };
        this._ideaService.GetIdeasByStatus(value).subscribe(
          (res) => {
            this.SpmIdea = res;
            this.SpmIdea = this.SpmIdea.statusIdeas.filter(
              (x: { isPushedIntoSpm: boolean }) => x.isPushedIntoSpm == true
            );
            this.SpmIntegrationCount = this.SpmIdea ? this.SpmIdea.length : 0;
            this.approvedIdeaCount =
              this.status.status.approved - this.SpmIntegrationCount;
          },
          (err) => {
            this.loading = false;
          }
        );

        this._ideaService.GetStatusCount(this._subdomain).subscribe(
          (res: StatusCount) => {
            this.status = res;
            this.approvedIdeaCount =
              this.status.status.approved - this.SpmIntegrationCount;
          },
          (err: any) => {}
        );
      },
      (err) => {}
    );

    // this._ideaService.HashClickEvent.subscribe((e) => {
    //   this.filterIdeaKey = e;
    //   this.filterKeyValue = '#' + e;
    //   this.Search();
    // });

    this._ideaService.AtTheClickEvent.subscribe((e) => {
      this.filterUserId = e;
      this._route.navigate(['/organisation/userdetail', e]);
      // this._route.navigateByUrl(
      //   '/organisation/userdetail?id=' +
      //     e +
      //     '&OrganisationDomain=' +
      //     this.organisationDomain
      // );
    });
  }

  // ngAfterViewInit() {
  //   let curr: HTMLElement = document.getElementsByClassName('btn1' )[0] as HTMLElement;
  //   let str = " active"
  //   curr.className = curr.className.concat(str);
  // }

  getAllIdea() {
    this.loading = true;
    this._ideaService.getAllIdea(this._subdomain).subscribe(
      (res: any) => {
        this.filterByUser = '';
        this.filter = false;
        this.ideas = res;
        this.flag = true;
        this.ideas = this.ideas.ideas;

        this.allIdeaLength = this.ideas ? this.ideas.length : 0;
        this.loading = false;
        //this.Id = this.idealist.id;
        // this.emailId=this.userlist.users.emailId;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }
  filterIdeaOnStatus(status: number) {
    this.loading = true;
    var value = {
      organisationDomain: this._subdomain,
      ideastatus: status,
    };
    this._ideaService.GetIdeasByStatus(value).subscribe(
      (res) => {
        this.flag = false;
        this.filterByUser = '';
        this.filter = false;
        this.ideas = res;
        if (status == 3) {
          this.ideas = this.ideas.statusIdeas.filter(
            (x: { isPushedIntoSpm: boolean }) => x.isPushedIntoSpm != true
          );
        } else this.ideas = this.ideas.statusIdeas;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  getSpmIntegratedIdea() {
    this.loading = true;
    var value = {
      organisationDomain: this._subdomain,
      ideastatus: 3,
    };
    this._ideaService.GetIdeasByStatus(value).subscribe(
      (res) => {
        this.flag = false;
        this.filterByUser = '';
        this.filter = false;
        this.ideas = res;
        this.ideas = this.ideas.statusIdeas.filter(
          (x: { isPushedIntoSpm: boolean }) => x.isPushedIntoSpm == true
        );
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  needForApproval() {
    this.loading = true;
    this._ideaService.GetIdeasForApprovers(this._subdomain).subscribe(
      (res) => {
        this.flag = false;
        this.filterByUser = '';
        this.filter = false;
        this.ideas = res;

        this.ideas = this.ideas.approverIdeas;

        this.approverideas = this.ideas.length;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  getCurrentUser() {
    let user = new User();
    user.Id = this.userId;
    this._userService.getCurrentUser(user).subscribe(
      (res) => {
        this.users = res;
        this.spmEnabled = this.users.users.isSpmEnabled;
        if (this.users && this.users.users && this.users.users.userImage) {
          this.profilePic =
            this.users.users.userImage.imageSrc +
            '?' +
            Math.random().toString(16).substr(2, 8).toUpperCase();
        } else this.profilePic;
      },
      (error) => {}
    );
  }

  getRefreshIdeaList(e: any) {
    var value1 = {
      id: e,
      organisationDomain: this.organisationDomain,
    };
    this._ideaService.RefreshIdea(value1).subscribe(
      (res) => {
        this.data = res;
      },
      (err) => {}
    );
  }

  // refreshIdeaPost() {
  //   if (this.filterIdeaKey) {
  //     this.loading = true;
  //     var value = {
  //       organisationDomain: this.organisationDomain,
  //       skillKey: this.filterIdeaKey,
  //     };
  //     this._ideaService.getIdeawithKey(value).subscribe(
  //       (res) => {
  //         this.ideas = res;
  //         this.ideas = this.ideas.ideas;
  //         this.loading = false;
  //       },
  //       (err) => {
  //         this.loading = false;
  //       }
  //     );
  //   }
  // }

  GetIdeaById(IdeaId: any, index: number) {
    var value1 = {
      id: IdeaId,
      organisationDomain: this.organisationDomain,
    };
    this._ideaService.RefreshIdea(value1).subscribe(
      (res: any) => {
        var idea = res.idea;
        if (this.filter) this.ideaList[index] = idea;
        else this.ideas[index] = idea;
      },
      (err) => {}
    );
  }

  onClick(idea: any) {
    if (!this.filterIdeaKey && !this.filterUserId) {
      this._route.navigateByUrl(
        '/organisation/idea-main-details-page?id=' +
          idea.id +
          '&OrganisationDomain=' +
          this._subdomain,
        +'&input=' + idea.needMyInput
      );
    }
  }

  ShowIdeaForm(idea: any, formContent: any, index: number) {
    this.modalService.open(formContent, { size: 'lg' });
    this.Ideaid = idea.id;
    this.Ideadomain = idea.organisationDomain;
  }

  ShowCommentLikeUser(comment: any, formContent: any) {
    this.CommentId = comment.id;
    this.modalService.open(formContent, { size: 'sm', backdrop: 'static' });
  }

  ShowCommentUnlikeUser(comment: any, formContent: any) {
    this.CommentId = comment.id;
    this.modalService.open(formContent, { size: 'sm', backdrop: 'static' });
  }

  CommentLikeUsers(comment: any) {
    this.CommentId = comment.id;
  }

  CommentUnlikeUsers(comment: any) {
    this.CommentId = comment.id;
  }

  ShowPrivacyForm(idea: any, formContent: any) {
    this.idea = idea;
    this.Ideaid = idea.id;
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  ShowApproverForm(idea: any, formContent: any) {
    this.Ideaid = idea.id;
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }

  safeUrl(videoUrl: any) {
    var str = videoUrl;
    var substr = str.substring(str.length - 11, str.length);
    return this._sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/' + substr
    );
  }

  // addLike(idea: any) {
  //   var value = {
  //     ideaId: idea.idea.id,
  //     organisationDomain: idea.idea.organisationDomain,
  //   };

  //   this._ideaService.addLike(value).subscribe(
  //     (res) => {
  //       this._toastr.info('You have Upvoted this Idea', '', {
  //         timeOut: 3000,
  //       });
  //       this.like = res;
  //       if (this.like.message == 'Like Added') {
  //         idea.totalLike += 1;
  //       }
  //       if (
  //         this.like.message ==
  //         'Like Added, Dislike removed as it was already disliked'
  //       ) {
  //         idea.totalLike += 1;
  //         idea.totalUnlike -= 1;
  //       }
  //       this.GetIdeaById(idea.idea.id, idea.index);
  //       this._ideaService.notificationCount();
  //     },
  //     (err: any) => {
  //       this._toastr.info('You have removed Upvote from this Idea', '', {
  //         timeOut: 3000,
  //       });
  //       this.errorMessage = err.error.ErrorMessage;
  //       if (err.error.ErrorMessage == 'Like Removed') {
  //         idea.totalLike -= 1;
  //       }
  //     }
  //   );
  // }

  addLike(idea: any) {
    var value = {
      ideaId: idea.idea.id,
      organisationDomain: idea.idea.organisationDomain,
    };

    this._ideaService.IdeaLike(value).subscribe(
      (res) => {
        this.like = res;

        if (
          this.like.message == 'Like' ||
          this.like.message == 'DislikeRemovedLike'
        ) {
          this._toastr.info('You have Upvoted this Idea', '', {
            timeOut: 3000,
          });
        } else {
          this._toastr.info('You have removed Upvote from this Idea', '', {
            timeOut: 3000,
          });
        }
        this.GetIdeaById(idea.idea.id, idea.index);
        this._ideaService.notificationCount();
      },
      (err: any) => {}
    );
  }

  addUnlike(idea: any) {
    var value = {
      ideaId: idea.idea.id,
      organisationDomain: idea.idea.organisationDomain,
    };

    this._ideaService.IdeaDislike(value).subscribe(
      (res) => {
        this.unlike = res;

        if (
          this.unlike.message == 'Disike' ||
          this.unlike.message == 'LikeRemovedDislike'
        ) {
          this._toastr.info('You have Downvoted this Idea', '', {
            timeOut: 3000,
          });
        } else {
          this._toastr.info('You have removed Downvote from this Idea', '', {
            timeOut: 3000,
          });
        }
        this.GetIdeaById(idea.idea.id, idea.index);
        this._ideaService.notificationCount();
      },
      (err: any) => {}
    );
  }

  addFollower(idea: any) {
    var value = {
      IdeaId: idea.id,
      organisationDomain: this._subdomain,
    };
    this._ideaService.CreateIdeaFollowUp(value).subscribe((res) => {
      this._toastr.info('You start following this Idea', '', {
        timeOut: 3000,
      });
    });
  }

  removeFollower(idea: any) {
    var value = {
      IdeaId: idea.id,
      organisationDomain: this._subdomain,
    };
    this._ideaService.DeleteIdeaFollower(value).subscribe((res) => {
      this._toastr.info('You UnFollow this Idea', '', {
        timeOut: 3000,
      });
    });
  }

  // addUnlike(idea: any) {
  //   var value = {
  //     ideaId: idea.idea.id,
  //     organisationDomain: idea.idea.organisationDomain,
  //   };
  //   this._ideaService.addUnlike(value).subscribe(
  //     (res) => {
  //       this._toastr.info('You have Downvote this Idea', '', {
  //         timeOut: 3000,
  //       });
  //       this.unlike = res;
  //       if (this.unlike.message == 'Dislike Added') {
  //         idea.totalUnlike += 1;
  //       }
  //       if (
  //         this.unlike.message ==
  //         'Dislike Added,Like removed as it was already liked'
  //       ) {
  //         idea.totalLike -= 1;
  //         idea.totalUnlike += 1;
  //       }
  //       this.GetIdeaById(idea.idea.id, idea.index);
  //       this._ideaService.notificationCount();
  //     },
  //     (err: any) => {
  //       this._toastr.info('You have removed Downvote from this Idea', '', {
  //         timeOut: 3000,
  //       });
  //       this.errorMessage = err.error.ErrorMessage;
  //       if (err.error.ErrorMessage == 'Unlike Removed') {
  //         idea.totalUnlike -= 1;
  //       }
  //     }
  //   );
  // }

  Post(e: any) {
    this.idIdea = e.idea.id;
    this.refreshideaId = e.idea.id;
    var value = {
      message: e.PostMessage,
      ideaId: this.idIdea,
      organisationDomain: this.organisationDomain,
    };
    this._ideaService.createComment(value).subscribe(
      (res: any) => {
        this._toastr.info('You have Commented on this Idea', '', {
          timeOut: 3000,
        });
        var comment = res;
        this.PostMessage = '';
        this.GetIdeaById(this.idIdea, e.index);
        this._ideaService.notificationCount();
      },
      (err: any) => {}
    );
  }

  CommentLike(comment: any) {
    this.CommentId = comment.comment.id;
    this.idIdea = comment.comment.ideaId;
    var value = {
      commentId: this.CommentId,
      IdeaId: this.idIdea,
      organisationDomain: this.organisationDomain,
    };

    this._ideaService.addCommentLike(value).subscribe(
      (res) => {
        this._toastr.info('You have Upvoted this Comment', '', {
          timeOut: 3000,
        });
        this.like = res;

        this.GetIdeaById(comment.comment.ideaId, comment.index);
        this._ideaService.notificationCount();
      },
      (err: any) => {
        this._toastr.info('You have removed Upvote from this Comment', '', {
          timeOut: 3000,
        });
        this.GetIdeaById(comment.comment.ideaId, comment.index);
        this._ideaService.notificationCount();
      }
    );
  }

  CommentUnlike(comment: any) {
    this.CommentId = comment.comment.id;
    this.idIdea = comment.comment.ideaId;
    var value = {
      commentId: this.CommentId,
      IdeaId: this.idIdea,
      organisationDomain: this.organisationDomain,
    };
    this._ideaService.addCommentUnlike(value).subscribe(
      (res) => {
        this._toastr.info('You have Downvoted this Comment', '', {
          timeOut: 3000,
        });
        this.unlike = res;
        this.GetIdeaById(comment.comment.ideaId, comment.index);
        this._ideaService.notificationCount();
        // this._ideaService.onEventTrigger.emit();
      },
      (err: any) => {
        this._toastr.info('You have removed Downvote from this Comment', '', {
          timeOut: 3000,
        });
        this.GetIdeaById(comment.comment.ideaId, comment.index);
        this._ideaService.notificationCount();
      }
    );
  }

  CommentComment(e: any) {
    this.CommentId = e.comment.id;
    this.idIdea = e.comment.ideaId;
    var value = {
      commentId: this.CommentId,
      organisationDomain: this.organisationDomain,
      message: e.CommentMessage,
      IdeaId: this.idIdea,
    };
    this._ideaService.addCommentComment(value).subscribe(
      (res) => {
        this._toastr.info('You have replied to this this Comment', '', {
          timeOut: 3000,
        });
        this.commentcomment = res;
        this.CreateCommentComment = false;
        this.CommentMessage = '';
        this.GetIdeaById(e.comment.ideaId, e.index);
        this._ideaService.notificationCount();
      },
      (err: any) => {
        this._toastr.info('Not able to reply on this Comment', '', {
          timeOut: 3000,
        });
      }
    );
  }

  onDelete(comment: any) {
    var value = {
      id: comment.comment.id,
      ideaId: comment.comment.ideaId,
      organisationDomain: this.organisationDomain,
    };
    this._ideaService.deleteComment(value).subscribe(
      (res: any) => {
        this._toastr.success('Comment deleted successfully', '', {
          timeOut: 3000,
        });
        this.GetIdeaById(comment.comment.ideaId, comment.index);
        this._ideaService.notificationCount();
      },
      (err: any) => {}
    );
  }

  ReplyDelete(e: any) {
    var value = {
      id: e.reply.id,
      commentId: e.replyCommentId,
      organisationDomain: this.organisationDomain,
    };

    this._ideaService.deleteCommentComment(value).subscribe(
      (res: any) => {
        this._toastr.success('Comment Reply deleted successfully', '', {
          timeOut: 3000,
        });
        this.GetIdeaById(e.idea.id, e.index);
        this._ideaService.notificationCount();
      },
      (err: any) => {}
    );
  }

  DeleteIdea(e: any) {
    var value = {
      id: e.idea.id,
      organisationDomain: this.organisationDomain,
    };
    this._ideaService.deleteIdea(value).subscribe(
      (response) => {
        this._toastr.info('Idea deleted successfully', '', {
          timeOut: 3000,
        });
        if (this.filter) this.allIdeaLength = this.allIdeaLength - 1;
        this.ideaList.splice(e.index, 1);
        this.ideas.splice(e.index, 1);
        var value = {
          ideaStatus: e.idea.status,
          ideaType: '9',
        };
        this._ideaService.ideaCount(value);
        this._ideaService.notificationCount();
      },
      (error) => {}
    );
  }

  RefreshIdea(status: any) {
    var value = {
      organisationDomain: this._subdomain,
      ideastatus: status,
    };
    this._ideaService.GetIdeasByStatus(value).subscribe(
      (res) => {
        this.ideas = res;
        this.ideas = this.ideas.statusIdeas;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  ShowCommentForm(comment: any) {
    this.idComment = comment.id;
    this.CommentMessage = comment.message;
    this.editComment = true;
  }

  onEdit(e: any) {
    var value = {
      id: e.comment.id,
      ideaId: e.comment.idea.id,
      organisationDomain: this.organisationDomain,
      message: e.CommentMessage,
      userId: e.comment.user.id,
    };
    this._ideaService.updateComment(value).subscribe(
      (res: any) => {
        this._toastr.success('Comment updated successfully', '', {
          timeOut: 3000,
        });
        var comment = res;
        this.modalService.dismissAll();
        this.editComment = false;
        this.GetIdeaById(e.comment.idea.id, e.index);
        this._ideaService.notificationCount();
      },
      (err: any) => {
        this.modalService.dismissAll();
        this.editComment = false;
      }
    );
  }

  ShowReplyCommentForm(reply: any, replyCommentId: any) {
    this.idReplyComment = reply.id;
    this.commentReplyId = replyCommentId;
    this.CommentReplyEditMessage = reply.message;
    this.editReplyComment = true;
  }

  onEditCommentReply(e: any) {
    var value = {
      id: e.reply.id,
      commentId: e.replyCommentId,
      organisationDomain: this.organisationDomain,
      message: e.CommentReplyEditMessage,
      userId: e.reply.user.id,
    };
    this._ideaService.updateCommentComment(value).subscribe(
      (res: any) => {
        this._toastr.success('Comment reply updated successfully', '', {
          timeOut: 3000,
        });
        var comment = res;
        this.modalService.dismissAll();
        this.editComment = false;
        this.GetIdeaById(e.ideaId, e.index);
        this._ideaService.notificationCount();
      },
      (err: any) => {
        this.modalService.dismissAll();
        this.editComment = false;
      }
    );
  }

  sendIdeatoBackLog(e: any) {
    let formData = new FormData();
    formData.append('ideaId', e.idea.id);
    formData.append('organisationDomain', this.organisationDomain);
    formData.append('status', e.status);
    this._ideaService.changeIdeaStatus(formData).subscribe(
      (res) => {
        this._toastr.success('Status changed Successfully', '', {
          timeOut: 3000,
        });
        if (this.windowUrl != this.localUrl && this.windowUrl != this.prodUrl)
          this._route.navigate(['/organisation/idea-main/recent-idea']);
        var value = {
          ideaStatus: e.status,
          ideaType: e.idea.status,
        };
        this._ideaService.ideaCount(value);
        this._ideaService.ideaRecentlyUpdated(e.idea.id);

        if (this.flag) {
          this._ideaService.ideaUpdate(e.idea.id, e.index);
        } else {
          if (this.filter) this.ideaList.splice(e.index, 1);
          this.ideas.splice(e.index, 1);
        }
      },
      (err) => {
        this._toastr.error('Status change Failed', '', {
          timeOut: 3000,
        });
      }
    );
  }

  changeIdeaStatus(e: any) {
    let formData = new FormData();
    formData.append('ideaId', e.idea.id);
    formData.append('organisationDomain', this.organisationDomain);
    formData.append('status', e.status);

    this._ideaService.changeIdeaStatus(formData).subscribe(
      (res) => {
        this._toastr.success('Status changed Successfully', '', {
          timeOut: 3000,
        });
        if (this.windowUrl != this.localUrl && this.windowUrl != this.prodUrl)
          this._route.navigate([
            '/organisation/idea-main/under-evaluation-idea',
          ]);

        var value;
        if (e.idea.isCurrentUserIsApprover) {
          value = {
            ideaStatus: '1',
            ideaType: 1.1,
          };
        } else {
          value = {
            ideaStatus: '1',
            ideaType: e.idea.status,
          };
        }
        this._ideaService.ideaCount(value);
        this._ideaService.ideaRecentlyUpdated(e.idea.id);
        if (this.flag) {
          this._ideaService.ideaUpdate(e.idea.id, e.index);
        } else {
          if (this.filter) this.ideaList.splice(e.index, 1);
          this.ideas.splice(e.index, 1);
        }
      },
      (err) => {
        this._toastr.error('Status change Failed', '', {
          timeOut: 3000,
        });
      }
    );
  }

  ConnectProject(e: any) {
    debugger;
    var magicToken = this._authservice.getMagicToken();
    var value = {
      ideaId: e.idea.id,
      magicToken: magicToken,
      orgDomain: this._subdomain,
      cosId: e.cosId
    };

    this._ideaService.PushIdeaToSpm(value).subscribe(
      (res: any) => {
        this.approvedIdeaCount -= 1;
        this.SpmIntegrationCount += 1;
        if (this.filter) this.ideaList.splice(e.index, 1);
        this.ideas.splice(e.index, 1);
        this._toastr.success('Idea has been successfully pushed into SPM', '', {
          timeOut: 3000,
        });
      },
      (err: any) => {
        this._toastr.success('Some error occured. please contact your SPM Admin.', '', {
          timeOut: 3000,
        });
      }
    );
  }

  toggleTag() {
    this.showInputSearch = !this.showInputSearch;
  }

  Search() {
    this.filter = true;
    var copy = this.ideas;
    this.ideaList = copy.filter((res: any) => {
      return res.statement
        .toLocaleLowerCase()
        .match(this.filterKeyValue.toLocaleLowerCase());
    });
  }

  filterIdeaByCreatedUser() {
    this.filter = true;
    var copy = this.ideas;
    this.ideaList = copy.filter((res: any) => {
      return (
        res.createdBy.firstName
          .toLocaleLowerCase()
          .match(this.filterByUser.toLocaleLowerCase()) ||
        res.createdBy.lastName
          .toLocaleLowerCase()
          .match(this.filterByUser.toLocaleLowerCase())
      );
    });
  }
}
