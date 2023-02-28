import { Component, Inject, OnInit } from '@angular/core';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-tag-grid',
  templateUrl: './tag-grid.component.html',
  styleUrls: ['./tag-grid.component.css']
})
export class TagGridComponent implements OnInit {
tagList:any;
newTag:boolean=false;

OrganisationId :any;
Organisation :any;

tagCreateForm = new FormGroup({
code: new FormControl('', Validators.required),
description: new FormControl('', Validators.required),
});
  constructor(private orgService: OrganisationService,
              private _toastr: ToastrService,
               @Inject(SUB_DOMAIN) private _subdomain:string) { }

  ngOnInit(): void {
    this.orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.Organisation = res;
        this.OrganisationId = this.Organisation.organisations.id;
        this.orgService.getAllTag(this.OrganisationId).subscribe(
          (res) => {
            this.tagList = res;
            this.tagList = this.tagList.tags;
          },
          (error) => {
          }
        );
      },
      (error) => {
      }
    )
    
  }
  onSaving(event:any){
    
    const orgTag = { ...event?.changes[0].data,id:event?.changes[0].key.id, OrganisationId:this.OrganisationId}
    
    
    
    this.orgService.updateTag(orgTag).subscribe(response=>
       {
        this._toastr.success('Team updated successfully', '', {
          timeOut: 3000,
        });
       },(error=>
        {
          
        }
        )
      );
    
      }
     
    tag(){
      this.newTag=true;
      
      }
      close(){
        this.newTag=false;
      }

      onSubmit() {
        var value = {
          code: this.tagCreateForm.value.code,
         description: this.tagCreateForm.value.description,
         OrganisationId:this.OrganisationId
    };
    this.orgService.createTag(value).subscribe(
    (res: any) => {
      this._toastr.success('Tag created successfully', '', {
        timeOut: 3000,
      });
      this.tagCreateForm.reset();
      this.newTag=false;
      this.orgService.getAllTag(this.OrganisationId).subscribe(
        (res) => {
          this.tagList = res;
          this.tagList = this.tagList.tags;
        },
        (error) => {
        }
      );
    },
    (error: { error: { ErrorMessage: string; }; }) => {
    }
    );
    }
  
  }
