import { Injectable } from '@angular/core';
import { Category } from '../shared/category.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  category: Category;
  constructor(private http: HttpClient) { }
  createCategory(category: Category) {
    return this.http.post(
      environment.apiOrgUrl + 'OrgService/CreateCategory',
      category
    );
  }
  getAllCategory(OrganisationId: string):Observable<Category> {
    return this.http.get<Category>(
      environment.apiOrgUrl + 'OrgService/GetAllCategory?id=' + OrganisationId
    );
  }
 
  getCategoryById(value: any) {
    return this.http.get(
      environment.apiOrgUrl + 'OrgService/GetCategoryById?id=' + value
    );
  }
  updateCategory(category: any) {
    return this.http.put(
      environment.apiOrgUrl + `OrgService/UpdateCategory/${category.id}`,
      category
    );
  }
}
