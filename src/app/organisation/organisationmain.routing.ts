import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth.guard";
import { AllNotificationComponent } from "./all-notification/all-notification.component";
import { ApproverFormComponent } from "./approver-form/approver-form.component";
import { CommentdislikedComponent } from "./commentdisliked/commentdisliked.component";
import { CommentlikedComponent } from "./commentliked/commentliked.component";
import { IdeaDetailComponent } from "./idea-detail/idea-detail.component";
import { IdeaFormComponent } from "./idea-form/idea-form.component";
import { IdeaListComponent } from "./idea-list/idea-list.component";
import { ApprovedIdeaComponent } from "./idea-main-page/approved-idea/approved-idea.component";
import { FreshIdeaComponent } from "./idea-main-page/fresh-idea/fresh-idea.component";
import { IdeaMainPageComponent } from "./idea-main-page/idea-main-page.component";
import { MyInputIdeaComponent } from "./idea-main-page/my-input-idea/my-input-idea.component";
import { MyReviewedIdeaComponent } from "./idea-main-page/my-reviewed-idea/my-reviewed-idea.component";
import { RecentIdeaComponent } from "./idea-main-page/recent-idea/recent-idea.component";
import { UnderApprovalIdeaComponent } from "./idea-main-page/under-approval-idea/under-approval-idea.component";
import { UnderEvaluationIdeaComponent } from "./idea-main-page/under-evaluation-idea/under-evaluation-idea.component";
import { NotificationComponent } from "./notification/notification.component";
import { OrganisationManageComponent } from "./organisation-manage/organisation-manage.component";
import { OrganisationSettingComponent } from "./organisation-setting/organisation-setting.component";
import { OrganisationComponent } from "./organisation.component";
import { PrivacyFormComponent } from "./privacy-form/privacy-form.component";
import { CategoryGridComponent } from "./standard-code/category-grid/category-grid.component";
import { DepartmentGridComponent } from "./standard-code/department-grid/department-grid.component";
import { StandardCodeComponent } from "./standard-code/standard-code.component";
import { TagGridComponent } from "./standard-code/tag-grid/tag-grid.component";
import { TeamFormComponent } from "./team-form/team-form.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserdetailComponent } from "./userdetail/userdetail.component";
import { UserSelectFormComponent } from "./user-select-form/user-select-form.component";
import { AddUserComponent } from "./add-user/add-user.component";
import { UserFormComponent } from "./user-form/user-form.component";
import { UpdateUserComponent } from "./update-user/update-user.component";
import { ConnectorsComponent } from "./connectors/connectors.component";
import { SpmRedirectionComponent } from "./spm-redirection/spm-redirection.component";
import { IdeaMainDetailsPageComponent } from "./idea-main-page/idea-main-details-page/idea-main-details-page.component";
// import { DetailsPageComponent } from "../details-page/details-page.component";

const routes: Routes = [
  {
    path: '',
    component: OrganisationComponent,
    children: [
      { path: 'idea-list/:redirection', component: IdeaListComponent },
      { path: 'idea-list', component: IdeaListComponent },
      { path: 'idea-form', component: IdeaFormComponent },
      { path: 'privacy-form', component: PrivacyFormComponent },
      { path: 'commentliked', component: CommentlikedComponent },
      { path: 'commentdisliked', component: CommentdislikedComponent },
      { path: 'approver-form', component: ApproverFormComponent },
      { path: 'team-form', component: TeamFormComponent },
      { path: 'userdetail/:id', component: UserdetailComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'spm/:ProjectId/:Type', component: SpmRedirectionComponent },
      { path: 'all-notification', component: AllNotificationComponent },
      {
        path: 'add-user',
        component: AddUserComponent,
        children: [{ path: 'user', component: UserFormComponent }],
      },
      {
        path: 'update-user',
        component: UpdateUserComponent,
        children: [{ path: 'user', component: UserFormComponent }],
      },
      { path: 'connectors', component: ConnectorsComponent },
      { path: 'users', component: UserListComponent },
      { path: 'idea-detail-page', component: IdeaDetailComponent },
      { path: 'idea-main-details-page', component: IdeaMainDetailsPageComponent },
      
      {
        path: 'idea-main',
        component: IdeaMainPageComponent,
        children: [
          // { path: 'details-page', component: DetailsPageComponent},
          { path: 'fresh-idea', component: FreshIdeaComponent },
          {
            path: 'under-evaluation-idea',
            component: UnderEvaluationIdeaComponent,
          },
          { path: 'approved-idea', component: ApprovedIdeaComponent },
          {
            path: 'under-approval-idea',
            component: UnderApprovalIdeaComponent,
          },
          { path: 'recent-idea', component: RecentIdeaComponent },
          { path: 'my-reviewed-idea', component: MyReviewedIdeaComponent },
          { path: 'my-input-idea', component: MyInputIdeaComponent },
        ],
      },
      { path: 'organisation-setting', component: OrganisationSettingComponent },
      { path: 'organisation-manage', component: OrganisationManageComponent },
      {
        path: 'standardCode',
        component: StandardCodeComponent,
        children: [
          { path: 'departmentGrid', component: DepartmentGridComponent },
          { path: 'categoryGrid', component: CategoryGridComponent },
          { path: 'tagGrid', component: TagGridComponent },
        ],
      },
    ],
    canActivate: [AuthGuard],
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationMainRouteModule { }
