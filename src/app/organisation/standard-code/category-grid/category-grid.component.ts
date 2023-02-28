import { Component, Inject, OnInit } from '@angular/core';
import { OrganisationService } from 'src/app/shared/organisation.service';
import { CategoryService } from 'src/app/services/category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SUB_DOMAIN } from 'src/app/shared/subdomain.token';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/models/category-model';

@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.css']
})
export class CategoryGridComponent implements OnInit {
  categorylist: any;
  OrganisationId: any;
  newCategory: boolean = false;
  Organisation: any;
  CategoryId: any;
  selectedCategory: any;
  categories: any;
  category: Category;
  categoryCreateForm = new FormGroup({
    code: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  organisationDomain: string;
  code: boolean = true;

  constructor(private orgService: OrganisationService,
    private _toastr: ToastrService,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    @Inject(SUB_DOMAIN) private _subdomain: string) {
    this.orgService.listen().subscribe((m: any) => {
      this.refreshCategoryList();
    })
  }

  ngOnInit(): void {
    this.organisationDomain = this._subdomain;
    this.orgService.checkIfDomainExist(this._subdomain).subscribe(
      (res) => {
        this.Organisation = res;
        this.OrganisationId = this.Organisation.organisations.id
        this.refreshCategoryList();
      },
      (error) => {
      }
    )

  }

  refreshCategoryList() {

    this.orgService.getAllCategory(this.OrganisationId).subscribe(
      (res) => {
        this.categorylist = res;
        this.categorylist = this.categorylist.categories;
      },
      (error) => {
      }
    );

  }

  ShowCategoryForm(formContent: any) {
    this.CategoryId = ''
    this.modalService.open(formContent, { size: 'md', backdrop: 'static' });
  }


  onSaving() {
    this.category = new Category();
    this.category.Id = this.CategoryId;
    this.category.OrganisationId = this.OrganisationId;
    this.category.Code = this.categoryCreateForm.value.code;
    this.category.Description = this.categoryCreateForm.value.description;

    this.orgService.updateCategory(this.category).subscribe(response => {
      this._toastr.success('Category  updated successfully', '', {
        timeOut: 3000,
      });
      this.categoryCreateForm.reset();
      this.modalService.dismissAll();
      this.newCategory = false;
      this.orgService.filter('Update click');

    }, (error => { }
    ));
  }


  getCategoryByIdd() {
    this.categoryService.getCategoryById(this.CategoryId).subscribe(
      (res: any) => {
        this.categories = res;
        this.categoryCreateForm = new FormGroup({
          code: new FormControl(this.categories.category.code),
          description: new FormControl(this.categories.category.description)
        });
      });
  }


  onEdit(event: any, formContent: any) {
    this.categoryCreateForm = new FormGroup({
      code: new FormControl({ value: '', disabled: true }, Validators.required),
      description: new FormControl('', Validators.required),
    });
    this.modalService.open(formContent, { size: 'md', backdrop: 'static', });
    this.CategoryId = event.data.id
    if (this.CategoryId != '') {
      this.getCategoryByIdd();
    }
  }


  onDeleting(event: any) {
    var value = {
      Id: event.key.id,
      OrganisationDomain: this.organisationDomain
    }
    this.orgService.deleteCategory(value).subscribe(response => {
      this._toastr.success('Category deleted successfully', '', {
        timeOut: 3000,
      });
    }, (error => {}
    ));
  }

  onSubmit() {
    var value = {
      code: this.categoryCreateForm.value.code,
      description: this.categoryCreateForm.value.description,
      OrganisationId: this.OrganisationId
    };

    this.orgService.createCategory(value).subscribe(
      (res: any) => {
        this._toastr.success('Category  created successfully', '', {
          timeOut: 3000,
        });
        this.modalService.dismissAll();
        this.categoryCreateForm.reset();
        this.newCategory = false;
        this.orgService.filter('Update click');
      },
      (error: { error: { ErrorMessage: string; }; }) => {});
  }

  modalClose() {
    this.categoryCreateForm.reset();
    this.orgService.filter('Update click');
  }
}
