import {
  Component,
  Inject,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subscriber } from 'rxjs';
import { IdeaService } from 'src/app/services/idea.service';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { CurrencyPipe, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Tribute, { TributeOptions } from 'tributejs';
import { Attachment } from 'src/app/models/attachment-model';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user-model';

@Component({
  selector: 'app-idea-form',
  templateUrl: './idea-form.component.html',
  styleUrls: ['./idea-form.component.css'],
})
export class IdeaFormComponent implements OnInit {
  @ViewChild('attachments') attachment: any;

  public files: NgxFileDropEntry[] = [];

  fileList: File[] = [];
  listOfFiles: any[] = [];
  multipleAttachments: any[] = [];

  @Input() public idea_id: string;
  @Input() public idea_domain: string;
  @Input() public index: number;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();
  categoryCtrl = new FormControl();
  teamCtrl = new FormControl();
  filteredSkills: Observable<string[]>;
  filteredTeams: Observable<any[]>;
  filteredCategories: Observable<string[]>;
  skills: string[] = [];
  categories: string[] = [];
  allSkills: string[] = ['Angular', 'Python', '.Net', 'JavaScript', 'React'];
  allCategories: string[] = [];
  imageToUpload: File = null;
  fileToUpload: File[] = null;
  teams: any[] = [];
  allTeams: any[]= [];
  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('teamInput') teamInput: ElementRef<HTMLInputElement>;
  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;

  @ViewChild('autoTeam') autoTeam: MatAutocomplete;
  @ViewChild('autoSkill') autoSkill: MatAutocomplete;
  @ViewChild('autoCategory') autoCategory: MatAutocomplete;

  helper = new JwtHelperService();
  userId: '';
  Organisation: any;
  organisationDomain: any;
  organisationId: any;
  users: any;
  profilePic: '';
  fullName: string;
  ideaImage: any;
  statement: string;
  description: string;
  userName: string[] = [];
  userList: any;
  categoryList: any;
  categoryDespcription: string[] = [];

  ShowLoader = false;
  emailId: any;
  teamDescription: any;
  teamtagid: any;
  taggedids: any[] = [];
  ideastatus: any;
  // Tag start
  inputValue: string = '';
  @ViewChild('PostElement') PostElement: ElementRef<HTMLDivElement> | undefined;
  tributeOptions: TributeOptions<any> | undefined;
  tribute: Tribute<any> | undefined;
  teamList: any;
  teamLists: any;
  form: FormGroup;
  submitted: boolean;
  roles: any;
  idea: any;
  IdeaStatus: string;
  ideaTeams: any;
  tagUser: string;
  subs: string[] = [];
  div: string;
  listUsers:string[]=[];
  arlist:string[]=[];
  potentialIdString: string;
  pastedText: any;
  // Tag end

  constructor(
    public _orgService: OrganisationService,
    private _route: Router,
    public _userService: UserService,
    private _ideaservice: IdeaService,
    private modalService: NgbModal,
    private currencyPipe: CurrencyPipe,
    public _location: Location,
    private _toastr: ToastrService,
    private elementRef: ElementRef,
    public _authservice: AuthService,
    @Inject(SUB_DOMAIN) private _subdomain: string
  ) {
    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(''),
      map((skill: string | null) =>
        skill ? this._filterSkill(skill) : this.allSkills.slice()
      )
    );

    // this.filteredTeams = this.teamCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map((team: string | null) =>
    //     team ? this._filterTeam(team) : this.teamDescription.slice()
    //   )
    // );

    this.form = new FormGroup({
      ideaTitle: new FormControl(),
      description: new FormControl('', Validators.required),
      teams: new FormControl(),
      skills: new FormControl(),
      categories: new FormControl(),
      teamTags: new FormControl(),
      benefits: new FormControl(),
      challenges: new FormControl(),
      videoUrl: new FormControl(),
      coverImage: new FormControl(),
      budget: new FormControl(),
      efforts: new FormControl('',Validators.pattern("^[0-9]*$")),
    },
    );

    // this.filteredTeams = this.teamCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map((team: string | null) =>
    //     team ? this._filterTeam(team) : this.allTeams.slice()
    //   )
    // );
  }
  get f (){ return this.form.controls}

  ngOnInit(): void {
    const user = this._authservice.getUser();
    this.roles = user.Roles;
    const me = this;
    this.form.valueChanges.subscribe((form) => {
      if (form.budget) {
        this.form.patchValue(
          {
            budget: this.currencyPipe.transform(
              form.budget.replace(/\D/g, '').replace(/^0+/, ''),
              'USD',
              'symbol',
              '1.0-0'
            ),
          },
          { emitEvent: false }
        );
      }
    });
    const decodedToken = this.helper.decodeToken(localStorage.getItem('token'));
    this.userId = decodedToken.id;
    this.emailId = decodedToken.email;
    var value = {
      id: this.idea_id,
      organisationDomain: this._subdomain,
    };

    this._orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res: any) => {

        this.Organisation = res;
        this.organisationId = this.Organisation.organisations.id;
        this.organisationDomain =
          this.Organisation.organisations.organisationDomain;
          var localuser = new User();
          localuser.Id = this.userId;
          localuser.OrganisationDomain = this.organisationDomain;
        this._userService.getUserById(localuser).subscribe(
          (res) => {
            this.users = res;
            var firstName = this.users.users.firstName;
            var lastName = this.users.users.lastName;
            this.fullName = firstName + ' ' + lastName;
            if (this.users.users.userImage) {
              this.profilePic = this.users.users.userImage.imageSrc;
            } else {
              this.profilePic = '';
            }
          },
          (err) => {}
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
                    h.name
                      .toString()
                      .toLowerCase()
                      .indexOf(text.toLowerCase()) != -1
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

      //   const target = document.getElementById('testMultiple');
      //  if(target){

      //   target.addEventListener('paste',(event)=>{
      //    let paste = ((<any>event).clipboardData)  || (<any>window).clipboardData.getData('text');
      //     paste = paste.toUpperCase();
      //     const selection = window.getSelection();
      //     selection.deleteFromDocument();
      //     selection.getRangeAt(0).insertNode(document.createTextNode(paste));
      //     event.preventDefault();
      //   });

      // }


        this._userService.getAllUser(this.organisationDomain, false).subscribe(
          (res: any) => {
            this.userList = res;
            this.userList = this.userList.users;
            // this.userName= this.userList.map((user: { firstName: any; })=>user.firstName )

            // this.filteredTeams = this.teamCtrl.valueChanges.pipe(
            //      startWith(''),
            //      map((team: string | null) => team ? this._filterTeam(team) : this.userName.slice()));
            //      this.allTeams = this.userName;
          },
          (error: any) => {}
        );

        // this.refreshTeamList();

        this._orgService.getAllTeam(this.organisationId).subscribe(
          (res) => {
            this.teamList = res;
            this.teamList = this.teamList.teams;
            this.teamDescription = this.teamList.map((team: any) => ({
              id: team.id,
              description: team.description,
            }));


            this.filteredTeams = this.teamCtrl.valueChanges.pipe(
              startWith(''),
              map((team: string | null) =>
                team ? this._filterTeam(team) : this.teamDescription.slice()
              )
            );
            this.allTeams = this.teamDescription;



          },
          (error: any) => {}
        );

        // this.allTeams = [
        //   {
        //     id: 'c68b7911-b335-4015-8484-afb9751d67d7',
        //     code: '01',
        //     description: 'Development',
        //   },
        //   {
        //     id: 'c68b7911-b335-4015-8484-afb9751d67d9',
        //     code: '01',
        //     description: 'UI',
        //   },
        // ];

        this._orgService.getAllCategory(this.organisationId).subscribe(
          (res) => {
            this.categoryList = res;
            this.categoryList = this.categoryList.categories;

            this.categoryDespcription = this.categoryList.map(
              (category: { description: any }) => category.description
            );
            this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
              startWith(''),
              map((category: string | null) =>
                category
                  ? this._filterCategory(category)
                  : this.categoryDespcription.slice()
              )
            );
            this.allCategories = this.categoryDespcription;
          },
          (error) => {}
        );
      },
      (error: any) => {}
    );
    if (this.idea_id) {
      this._ideaservice.getIdeaById(value).subscribe(


        (res: any) => {
          //this.form.patchValue(res['ideas']);
          this.idea = res;
          this.skills = this.idea.ideas.skills;
          this.categories = this.idea.ideas.categories;
          // this.teams = idea.ideas.teams;
          this.teams = this.idea.ideas.ideaTeams;
          if(this.teams )
          {
            this.ideaTeams= this.idea.ideas.ideaTeams;
          }
          //
          this.teamDescription = this.ideaTeams.map((team: any) => ({
            id: team.team.id,
            description: team.team.description,
          }));
          this.teams = this.teamDescription;
          // this.filteredTeams = this.teamCtrl.valueChanges.pipe(
          //   startWith(''),
          //   map((team: string | null) =>
          //     team ? this._filterTeam(team) : this.teams.slice()
          //   )
          // );
          //
          this.ideastatus = this.idea.ideas.status;
          this.PostElement.nativeElement.innerHTML = this.idea.ideas['statement'];
          //   this.form.value.ideaTitle="battery"
          this.form = new FormGroup({
            ideaTitle: new FormControl(this.idea.ideas['statement']),
            description: new FormControl(this.idea.ideas['description']),
            teams: new FormControl(this.idea.ideas['teams']),
            skills: new FormControl(this.idea.ideas['skills']),
            categories: new FormControl(this.idea.ideas['categories']),
            benefits: new FormControl(this.idea.ideas['benefits']),
            challenges: new FormControl(this.idea.ideas['challenges']),
            videoUrl: new FormControl(this.idea.ideas['videoUrl']),
            //coverImage: new FormControl(idea.ideas.ideaCoverImg['imageDataBase64']),
            budget: new FormControl(this.idea.ideas['budget']),
            efforts: new FormControl(this.idea.ideas['efforts']),
          });
          if( this.idea.ideas.ideaCoverImg!= null ){
          this.ideaImage = this.idea.ideas.ideaCoverImg.imageSrc + '?' + Math.floor(1000000000 + Math.random() * 9000000000);

          }
          this.multipleAttachments = this.idea.ideas.ideaAttachments;
          this.multipleAttachments.forEach((element) => {
            this.listOfFiles.push(element.attachment);
            this.fileList.push(element.attachment);
          });

          //this.coverImage=idea.ideas.
        },
        (error: any) => {}
      );
    }
  }


  onPaste(event: ClipboardEvent) {
  //  event.preventDefault();
  //   let clipboardData = event.clipboardData  || (<any>window).clipboardData;
  //  this.pastedText = clipboardData.getData('text');
  //  const target = document.getElementById('PostElement');
  //  if(target!=null)
  //  {
  //  target.innerHTML=this.pastedText;
  //  if(target.innerHTML.length>= 25)
  //  {
  //    event.preventDefault();
  //  }
  //  }

  }

  refreshTeamList() {}

  addTeam(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our team
    if ((value || '').trim()) {
      this.teams.push();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.teamCtrl.setValue(null);
  }

  addSkill(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our skill
    if ((value || '').trim()) {
      this.skills.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.skillCtrl.setValue(null);
  }
  addCategory(event: MatChipInputEvent): void
   {

    const input = event.input;
    const value = event.value;
    if(this.roles !=='UnlicensedUser')
    {
    if (value) {

      var val = {
        code: Math.random().toString(16).substr(2, 8).toUpperCase(),
        description: value,
        OrganisationId: this.organisationId,
      };

        this._orgService.createCategory(val).subscribe(
          (res) => {},
          (err) => {}
        );


    }

    // Add our skill
    if ((value || '').trim()) {
      this.categories.push(value.trim());
    }

    // Reset the input value



  }

  else{


    this._toastr.error('User cannot create new category', '', {
      timeOut: 3000,
    });


}
    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.categoryCtrl.setValue(null);
  }

  removeTeam(team: any): void {

    // this.deleteIdeaTeam(team.id);
    const index = this.teams.indexOf(team);

    if (index >= 0) {
      this.teams.splice(index, 1);
    }
  }

  deleteIdeaTeam(teamId: string){
    let team =  {
            Id : teamId,
            IdeaId : this.idea_id,
            organidationDomain : this._subdomain
      }

    this._ideaservice.deleteTeam(team).subscribe((res) => {
      this._toastr.info('Idea Team has been successfully deleted', '', {
        timeOut: 3000,
      });
    });
  }

  removeSkill(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  removeCategory(category: string): void {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  selectedTeam(event: MatAutocompleteSelectedEvent): void {
    this.teams.push(event.option.value);
    this.teamInput.nativeElement.value = '';
    this.teamCtrl.setValue(null);
  }

  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    this.skills.push(event.option.viewValue);
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  selectedCategory(event: MatAutocompleteSelectedEvent): void {
    this.categories.push(event.option.viewValue);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  private _filterTeam(value: any): any[] {
    return this.allTeams.filter((team: any) => team);
  }

  private _filterSkill(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSkills.filter(
      (skill) => skill.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterCategory(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCategories.filter(
      (category) => category.toLowerCase().indexOf(filterValue) === 0
    );
  }

  fileOnSelect(file: any) {
    this.imageToUpload = <File>file.target.files[0];
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.ideaImage = event.target.result;
    };
    reader.readAsDataURL(this.imageToUpload);
  }

  // attachmentOnSelect(attachment: any) {
  //   // this.fileToUpload = attachment.target.files;

  //   for (var i = 0; i < attachment.target.files.length; i++) {
  //     var selectedFile = attachment.target.files[i];
  //     this.fileList.push(selectedFile);
  //     this.listOfFiles.push(selectedFile.name);

  //   }

  //   this.attachment.nativeElement.value = '';
  // }

  removeSelectedFile(index: number, id: string) {
    if (id) this.deleteAttachment(id);
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);

    // delete file from FileList
    this.fileList.splice(index, 1);

  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
        let filesize = file.size / 1024;
        filesize = filesize/1024;
          if(filesize > this.Organisation.organisations.maxFileSizeLimit/ 1024){
            this._toastr.warning('Please select file size less than' + this.Organisation.organisations.maxFileSizeLimit / 1024 + 'MB', '', {
              timeOut: 3000,
            });
          }
          else{
            this.fileList.push(file);
            this.listOfFiles.push(droppedFile.relativePath);
          }

        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;

      }
    }
  }

  public fileOver(event: any) {

  }

  public fileLeave(event: any) {

  }

  onSubmit() {


    this.submitted = true;
    if(this.form.invalid){
      return;
    }
   else{
    this.ShowLoader = true;

    if (this.idea_id) {

      this.ShowLoader = true;
      let formData = new FormData();
      formData.append('id', this.idea_id);
      formData.append('title', '');
      formData.append(
        'statement',
        this.PostElement?.nativeElement.innerHTML.toString()
      );

      this.tagUser =this.PostElement?.nativeElement.innerHTML.toString()

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
          this.listUsers.forEach((user)=>{
            var startIndex = user.indexOf("data=\"");
            var endIndex = user.lastIndexOf("\">");
            startIndex += "data=\"".length;
            this.potentialIdString = user.substring(startIndex, endIndex);
            this.arlist.push(this.potentialIdString);

          });
        }
      formData.append('description', this.form.value.description);
      formData.append('attachment', '');
      if (this.form.value.benefits) {
        formData.append('benefits', this.form.value.benefits);
      } else {
        formData.append('benefits', '');
      }
      if (this.form.value.challenges) {
        formData.append('challenges', this.form.value.challenges);
      } else {
        formData.append('challenges', '');
      }
      if (this.form.value.videoUrl) {
        formData.append('videoUrl', this.form.value.videoUrl);
      } else {
        formData.append('videoUrl', '');
      }

      for (let category of this.categories) {
        formData.append('categories[]', category);
      }
      for (let skill of this.skills) {
        formData.append('skills[]', skill);
      }

        // this.teams = this.teams.map((team) => team.id);
        for (let team of this.teams) {

          formData.append('teamIds[]', team.id);
        }

      if (this.form.value.efforts) {
        formData.append('efforts', this.form.value.efforts);
      } else {
        formData.append('efforts', '');
      }
      formData.append(
        'code',
        Math.random().toString(16).substr(2, 8).toUpperCase()
      );
      if (this.form.value.budget) {
        formData.append('budget', this.form.value.budget);
      } else {
        formData.append('budget', '');
      }
      formData.append('organisationDomain', this.organisationDomain);
      formData.append('orgId', this.organisationId);
      if (this.imageToUpload)
        formData.append(
          'ImageFile',
          this.imageToUpload,
          this.imageToUpload.name
        );
      else formData.append('ImageFile', '');

      if (this.fileList) {

        for (let i = 0; i < this.fileList.length; i++) {

          formData.append('AttachmentFile', this.fileList[i]);
        }
      } else formData.append('AttachmentFile', '');
      formData.append('status', this.ideastatus);
      for (let tagusers of this.arlist) {
        formData.append('TaggedUserIds[]', tagusers);
      }
      this._ideaservice.updateIdea(formData).subscribe(
        (res) => {
          this._toastr.info('Idea updated successfully', '', {
            timeOut: 3000,
          });

          this._ideaservice.ideaUpdate(this.idea_id, this.index);
          this._ideaservice.ideaRecentlyUpdated(this.idea_id);
          this.modalService.dismissAll();
        },
        (error) => {
          // this._toastr.info(error.error.ErrorMessage, '', {
          //   timeOut: 3000,
          // });
          // this.ShowLoader = false;

        }
      );
    } else {
      let formData = new FormData();

      formData.append('title', '');
      formData.append(
        'statement',
        this.PostElement?.nativeElement.innerHTML.toString()

      );

      this.tagUser =this.PostElement?.nativeElement.innerHTML.toString()
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
          this.listUsers.forEach((user)=>{
            var startIndex = user.indexOf("data=\"");
            var endIndex = user.lastIndexOf("\">");
            startIndex += "data=\"".length;
            this.potentialIdString = user.substring(startIndex, endIndex);
            this.arlist.push(this.potentialIdString);

          });
        }

      formData.append('description', this.form.value.description);
      formData.append('attachment', '');
      if (this.form.value.benefits) {
        formData.append('benefits', this.form.value.benefits);
      } else {
        formData.append('benefits', '');
      }
      if (this.form.value.challenges) {
        formData.append('challenges', this.form.value.challenges);
      } else {
        formData.append('challenges', '');
      }
      if (this.form.value.videoUrl) {
        formData.append('videoUrl', this.form.value.videoUrl);
      } else {
        formData.append('videoUrl', '');
      }

      for (let category of this.categories) {
        formData.append('categories[]', category);
      }
      for (let skill of this.skills) {
        formData.append('skills[]', skill);
      }
      for (let team of this.teams) {

        formData.append('teamIds[]', team.id);
      }
      if (this.form.value.efforts) {
        formData.append('efforts', this.form.value.efforts);
      } else {
        formData.append('efforts', '');
      }
      formData.append(
        'code',
        Math.random().toString(16).substr(2, 8).toUpperCase()
      );
      if (this.form.value.budget) {
        formData.append('budget', this.form.value.budget);
      } else {
        formData.append('budget', '');
      }
      formData.append('organisationDomain', this.organisationDomain);
      formData.append('orgId', this.organisationId);
      if (this.imageToUpload)
        formData.append(
          'ImageFile',
          this.imageToUpload,
          this.imageToUpload.name
        );
      else formData.append('ImageFile', '');
      if (this.fileList) {

        for (let i = 0; i < this.fileList.length; i++) {

          formData.append(
            'AttachmentFile',
            this.fileList[i],
            this.fileList[i].name
          );
        }
      } else formData.append('AttachmentFile', '');
      formData.append('UserName', this.fullName);
      formData.append('EmailId', this.emailId);
      formData.append('UserImageUrl', this.profilePic);
      formData.append('status', '0');
      formData.append('privacy', '1');
      for (let tagusers of this.arlist) {
        formData.append('TaggedUserIds[]', tagusers);
      }

      this._ideaservice.createIdea(formData).subscribe(
        (res) => {
          this._toastr.info('You have Successfully posted the Idea', '', {
            timeOut: 3000,
          });
          var value = {
            ideaStatus: '0',
            ideaType: ''
          }
          let idea = res;
          this._ideaservice.ideaCount(value);
          this._ideaservice.ideaCreate(idea);
          this._ideaservice.notificationCount();
          this.modalService.dismissAll();
          this._route.navigate(['/organisation/idea-main/my-reviewed-idea']);
          this.IdeaStatus='Draft Ideas';
          this._ideaservice.ideaStatusTitle(this.IdeaStatus);
        },
        (error) => {
          this._toastr.info(error.error.ErrorMessage, '', {
            timeOut: 3000,
          });
          this.ShowLoader = false;

        }
      );
    }
   }
  }

  deleteAttachment(id: string) {
    let attachment = new Attachment();
    (attachment.AttachmentId = id),
      (attachment.OrganidationDomain = this.organisationDomain);

    this._ideaservice.deleteAttachment(attachment).subscribe((res) => {
      this._toastr.info('Attachment has been successfully deleted', '', {
        timeOut: 3000,
      });
    });
  }
}
