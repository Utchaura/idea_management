import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { IdeaService } from 'src/app/services/idea.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import Tribute, { TributeItem, TributeOptions } from 'tributejs';
import { StatusCount } from 'src/app/models/StatusCount-model';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user-model';

@Component({
  selector: 'app-idea-main-page',
  templateUrl: './idea-main-page.component.html',
  styleUrls: ['./idea-main-page.component.css'],
})
export class IdeaMainPageComponent implements OnInit {
  helper = new JwtHelperService();
  userId: any;
  Organisation: any;
  organisationId: any;
  organisationDomain: any;
  users: any;
  profilePic = '..//..//..//..//assets/admin.png';
  statement = ' ';
  description = '';
  ideaImage: string = '';
  imageToUpload: File = null;
  editorValueType: string = '';
  userName: string;
  emailId: any;
  allIdeas: any;
  sortLike: any;
  IdeaStatus: any;
  TotalLike: number = 0;
  TotalUnlike: number = 0;
  loading: boolean = false;
  userList: any;
  tagteam: any;
  whitelist$: Observable<string[]>;
  finalstatement: string;
  link: string;
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



  //Tag start
  inputValue: string | undefined = '';
  @ViewChild('PostElement') PostElement: ElementRef<HTMLDivElement> | undefined;
  tributeOptions: TributeOptions<any> | undefined;
  tribute: Tribute<any> | undefined;
  roles: any;
  needMyInput: boolean = false;
  user: any;
  pastedText: any;
  tagUser: string;
  subs: string[] = [];
  div: string;
  listUsers:string[]=[];
  arlist:string[]=[];
  potentialIdString: string;

  //Tag end

  constructor(
    public _orgService: OrganisationService,
    private _route: Router,
    public _userService: UserService,
    private _ideaService: IdeaService,
    private _toastr: ToastrService,
    private elementRef: ElementRef,
    public _authservice: AuthService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {
    this._ideaService.getIdeaCount().subscribe((status) => {
      const s = status;
        localStorage.setItem('idea-status', JSON.stringify(s));
      if(status.ideaType == 9){
        if(status.ideaStatus == 0){
          this.status.status.draft = this.status.status.draft - 1;
          this.IdeaStatus = 'Fresh Ideas';
          this._ideaService.ideaStatusTitle(this.IdeaStatus);
        }
        if(status.ideaStatus == 1){
          this.status.status.open = this.status.status.open - 1;
          this.IdeaStatus = 'Under Evaluation Ideas';
          this._ideaService.ideaStatusTitle(this.IdeaStatus);
        }
        if(status.ideaStatus == 2){
          this.status.status.underApproval = this.status.status.underApproval - 1;
          this.status.status.approver = this.status.status.approver - 1;
          this.IdeaStatus = 'Under Approval Ideas';
          this._ideaService.ideaStatusTitle(this.IdeaStatus);
        }
        if(status.ideaStatus == 4){
          this.status.status.publish = this.status.status.publish - 1;
          this.IdeaStatus = 'Fresh Ideas';
          this._ideaService.ideaStatusTitle(this.IdeaStatus);
        }

      }
      else{
        if(status.ideaStatus == 0){
          this.status.status.draft = this.status.status.draft + 1;
        }
        if(status.ideaStatus == 4){

          if(status.ideaType == 0){
              this.status.status.draft = this.status.status.draft - 1;
              this.status.status.publish = this.status.status.publish + 1;
              this.IdeaStatus = 'Fresh Ideas';
              this._ideaService.ideaStatusTitle(this.IdeaStatus);
          }
          if(status.ideaType == 4){
            this.IdeaStatus = 'Fresh Ideas';
            this._ideaService.ideaStatusTitle(this.IdeaStatus);
          }
        }
        if(status.ideaStatus == 3){
          this.status.status.underApproval = this.status.status.underApproval - 1;
          this.status.status.approver = this.status.status.approver - 1;
          this.status.status.approved = this.status.status.approved + 1;
          this.IdeaStatus = 'Approved Ideas';
          this._ideaService.ideaStatusTitle(this.IdeaStatus);
        }
        if(status.ideaStatus == 6){
          if(status.ideaType == 6){
          this.IdeaStatus = 'Idea Backlog';
          this._ideaService.ideaStatusTitle(this.IdeaStatus);
          }
          else{
            this.status.status.underApproval = this.status.status.underApproval - 1;
            this.status.status.approver = this.status.status.approver - 1;
            this.status.status.backlog = this.status.status.backlog + 1;
            this.IdeaStatus = 'Idea Backlog';
            this._ideaService.ideaStatusTitle(this.IdeaStatus);
          }
        }
        if(status.ideaStatus == 1){
            if(status.ideaType == 1){
              this.IdeaStatus = 'Under Evaluation Ideas';
              this._ideaService.ideaStatusTitle(this.IdeaStatus);
            }
            if(status.ideaType == 1.1){
              this.status.status.approver = this.status.status.approver - 1;
              this.status.status.underApproval = this.status.status.underApproval - 1;
              this.status.status.open = this.status.status.open + 1;
              this.IdeaStatus = 'Under Evaluation Ideas';
              this._ideaService.ideaStatusTitle(this.IdeaStatus);
            }
            if(status.ideaType == 2){
              this.status.status.underApproval = this.status.status.underApproval - 1;
              this.status.status.open = this.status.status.open + 1;
              this.IdeaStatus = 'Under Evaluation Ideas';
              this._ideaService.ideaStatusTitle(this.IdeaStatus);
            }
            if(status.ideaType == 4){
              this.status.status.publish = this.status.status.publish - 1;
              this.status.status.open = this.status.status.open + 1;
              this.IdeaStatus = 'Under Evaluation Ideas';
              this._ideaService.ideaStatusTitle(this.IdeaStatus);
            }
            if(status.ideaType == 6){
              this.status.status.backlog = this.status.status.backlog - 1;
              this.status.status.open = this.status.status.open + 1;
              this.IdeaStatus = 'Under Evaluation Ideas';
              this._ideaService.ideaStatusTitle(this.IdeaStatus);
            }
        }

        if(status.ideaStatus == 2){
          if(status.ideaType == 1){
            this.status.status.open = this.status.status.open - 1;
            this.status.status.underApproval = this.status.status.underApproval + 1;
            this.IdeaStatus = 'Under Approval Ideas';
            this._ideaService.ideaStatusTitle(this.IdeaStatus);
          }
          if(status.ideaType == 2){
            this.IdeaStatus = 'Under Approval Ideas';
            this._ideaService.ideaStatusTitle(this.IdeaStatus);
          }
          if(status.ideaType == 4){
            this.status.status.publish = this.status.status.publish - 1;
            this.status.status.underApproval = this.status.status.underApproval + 1;
            this.IdeaStatus = 'Under Approval Ideas';
            this._ideaService.ideaStatusTitle(this.IdeaStatus);
          }
        }

        if(status.ideaStatus == 'needmyInput' && status.ideaType == 2){
          this.IdeaStatus = 'Ideas Need Input';
          this._ideaService.ideaStatusTitle(this.IdeaStatus);
        }

        if(status.ideaStatus == 2.5){
          if(status.ideaType == 1){
            this.status.status.open = this.status.status.open - 1;
            this.status.status.underApproval = this.status.status.underApproval + 1;
            this.status.status.approver = this.status.status.approver + 1;
            this.IdeaStatus = 'Under Approval Ideas';
            this._ideaService.ideaStatusTitle(this.IdeaStatus);
          }

          if(status.ideaType == 2){
            this.status.status.approver = this.status.status.approver + 1;
            this.IdeaStatus = 'Under Approval Ideas';
            this._ideaService.ideaStatusTitle(this.IdeaStatus);
          }

          if(status.ideaType == 4){
            this.status.status.publish = this.status.status.publish - 1;
            this.status.status.underApproval = this.status.status.underApproval + 1;
            this.status.status.approver = this.status.status.approver + 1;
            this.IdeaStatus = 'Under Approval Ideas';
            this._ideaService.ideaStatusTitle(this.IdeaStatus);
          }
        }
      }

    });

    this._userService.refreshCurrentUser().subscribe((res) => {
    this.getCurrentUser();
    });
  }

  ngOnInit(): void {
    const me = this;
    this.user = this._authservice.getUser();
    this.emailId = this.user.Email;
    this.userId = this.user.id;
    // this.roles = this.user.Roles;
    // if(this.roles.includes("Approver")){
    //   this.needMyInput = true;
    // }
    this.getCurrentUser();

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
            this.userName = firstName + ' ' + lastName;
            if (this.users.users.userImage) {
              this.profilePic =
                this.users.users.userImage.imageSrc +
                '?' +
                Math.random().toString(16).substr(2, 8).toUpperCase();
            } else this.profilePic;
          },
          (err) => {}
        );
        this._ideaService.GetStatusCount(this.organisationDomain).subscribe(
          (res: StatusCount)=>{

            this.status = res;

          },
          (err:any) => {}
        );
      },
      (error) => {}
    );
    this.tributeOptions = {

      collection: [
        {

          trigger: '@',
          selectTemplate: (item: any) => {
            return `<a class="atthelink" data="${item.original.id}" >
                @${item.original.firstName} ${item.original.lastName}
                 </a>`;
          },
          values: function (text: string, cb: any) {
            me._userService
              .getAllUser(me.organisationId, false)
              .subscribe((res: any) => {
                let users = res.users.filter((u: any) => {
                  return (
                    u.firstName
                      .toString()
                      .toLowerCase()
                      .indexOf(text.toLowerCase()) != -1 ||
                    u.lastName
                      .toString()
                      .toLowerCase()
                      .indexOf(text.toLowerCase()) != -1
                  );
                });
                cb(users);
              });
          },
          lookup: (item: any) => {
            return `${item.firstName} ${item.lastName}`;
          },
        },
        {
          // The symbol that starts the lookup
          trigger: '#',
          selectTemplate: function (item: any) {
            return `<a class="hashlink" data="${item.original.name}">#${item.original.name}</a>`;
          },
          // function retrieving an array of objects
          values: function (text: any, cb: any) {
            let hasList = [
              { name: 'ArtifialIntelligence' },
              { name: 'Angular' },
              { name: 'DotNet' },
              { name: 'Javascript' },
              { name: 'Python' },
              { name: 'Idea' },
              { name: 'SuperIdea' },
            ];
            let filterHash = hasList.filter((h: any) => {
              return (
                h.name.toString().toLowerCase().indexOf(text.toLowerCase()) !=
                -1
              );
            });
            filterHash.unshift({ name: text });
            cb(filterHash);
          },
          lookup: 'name',

          fillAttr: 'name',
        },
      ],
    };
    this.tribute = new Tribute(this.tributeOptions);
    const element =
      this.elementRef.nativeElement.querySelector('#testMultiple');
    this.tribute.attach(element);
  }

  getCurrentUser() {
    var localuser = new User();
    localuser.Id = this.userId;
    localuser.OrganisationDomain = this.organisationDomain;
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
        // if (this.users.users.userImage) {
        //   this.profilePic =
        //     this.users.users.userImage.imageSrc + '?' + Math.floor(1000000000 + Math.random() * 9000000000);
        // } else this.profilePic;
      },
      (error) => { }
    );
  }

  onPaste(event: ClipboardEvent) {

  //   let clipboardData = event.clipboardData  || (<any>window).clipboardData;
  //  this.pastedText = clipboardData.getData('text');
  //  const target = document.getElementById('PostElement');
  //  target.innerHTML=this.pastedText;
  //  event.preventDefault();

  }
  // getAllUsers() {
  //   this._userService.getAllUser(this.organisationDomain, false);
  // }

  onClick(idea: any) {
    this._route.navigateByUrl(
      '/organisation/idea-main-details-page?id=' +
        idea.id +
        '&OrganisationDomain=' +
        idea.organisationDomain
    );
  }

  changeIdeaStatus(type: any) {
    this._ideaService.ideaStatusTitle(type);
  }

  fileOnSelect(file: any) {
    this.imageToUpload = <File>file.target.files[0];

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.ideaImage = event.target.result;
    };
    reader.readAsDataURL(this.imageToUpload);
  }

  createQuickIdea() {

    this.statement = this.PostElement?.nativeElement.innerHTML.toString();
    if (!this.statement && !this.description) {
      this._toastr.info('Please write idea statement and description', '', {
        timeOut: 3000,
      });
    }
    else if (!this.statement) {
      this._toastr.info('Please write idea statement', '', {
        timeOut: 3000,
      });
    }
    else if (!this.description) {
      this._toastr.info('Please write idea description', '', {
        timeOut: 3000,
      });
    } else {
      let formData = new FormData();
      formData.append('statement', this.statement);
      this.tagUser = this.statement;
      this.subs = this.tagUser.split("<a");
        if(this.subs.length!=0)
        {
          this.subs.forEach((element) => {
            if(element.includes('@'))
            {
              var st = element.indexOf("class");
              var end = element.lastIndexOf("@");
              st += "<a".length;
              this.div = element.substring(st, end - st);
              this.listUsers.push(this.div);
          }
            }

          );
          this.listUsers.forEach((user: string)=>{
            var startIndex = user.indexOf("data=\"");
            var endIndex = user.lastIndexOf("\">");
            startIndex += "data=\"".length;
            this.potentialIdString = user.substring(startIndex, endIndex);
            this.arlist.push(this.potentialIdString);

          });
        }
      formData.append('description', this.description);
      formData.append(
        'code',
        Math.random().toString(16).substr(2, 8).toUpperCase()
      );
      formData.append('organisationDomain', this.organisationDomain);
      formData.append('orgId', this.organisationId);
      if (this.imageToUpload)
        formData.append(
          'ImageFile',
          this.imageToUpload,
          this.imageToUpload.name
        );
      else formData.append('ImageFile', '');
      formData.append('UserName', this.userName);
      formData.append('EmailId', this.emailId);
      // formData.append('UserImageUrl', this.profilePic);
      formData.append('status', '0');
      for (let tagusers of this.arlist) {
        formData.append('TaggedUserIds[]', tagusers);
      }
      formData.append('privacy', '1');
      this.loading = true;
      this._ideaService.createIdea(formData).subscribe(
        (res) => {
          this.loading = false;
          this._toastr.info('You have Successfully posted the Idea', '', {
            timeOut: 3000,
          });
        var value = {
          ideaStatus: '0',
          ideaType: ''
        }
        this._ideaService.ideaCount(value);
          // this.status.status.draft = this.status.status.draft + 1;
          this.PostElement.nativeElement.innerHTML = '';
          this.description = '';
          this.ideaImage = '';
          this.TotalLike = 0;
          this.TotalUnlike = 0;

          // this._ideaService.onIdeaCreate.emit(res);
          let idea = res;
          this._ideaService.ideaCreate(idea);
          this._ideaService.notificationCount();
          this._route.navigate(['/organisation/idea-main/my-reviewed-idea']);
          this.IdeaStatus='Draft Ideas';
          this._ideaService.ideaStatusTitle(this.IdeaStatus);
        },
        (error) => {
          this._toastr.info(error.error.ErrorMessage, '', {
            timeOut: 3000,
          });
          this.loading = false;
        }
      );
    }
  }
}
