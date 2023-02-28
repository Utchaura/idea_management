import { NgModule } from '@angular/core';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { ApproverFormComponent } from './approver-form/approver-form.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { CommentdislikedComponent } from './commentdisliked/commentdisliked.component';
import { CommentlikedComponent } from './commentliked/commentliked.component';
import { IdeaDetailComponent } from './idea-detail/idea-detail.component';
import { IdeaFormComponent } from './idea-form/idea-form.component';
import { IdeaListComponent } from './idea-list/idea-list.component';
import { ApprovedIdeaComponent } from './idea-main-page/approved-idea/approved-idea.component';
import { FreshIdeaComponent } from './idea-main-page/fresh-idea/fresh-idea.component';
import { IdeaCardComponent } from './idea-main-page/idea-card/idea-card.component';
import { SingleIdeaComponent } from './idea-main-page/idea-card/single-idea/single-idea.component';
import { IdeaMainPageComponent } from './idea-main-page/idea-main-page.component';
import { JustApprovedIdeaComponent } from './idea-main-page/just-approved-idea/just-approved-idea.component';
import { MyInputIdeaComponent } from './idea-main-page/my-input-idea/my-input-idea.component';
import { MyReviewedIdeaComponent } from './idea-main-page/my-reviewed-idea/my-reviewed-idea.component';
import { RecentChangeIdeaComponent } from './idea-main-page/recent-change-idea/recent-change-idea.component';
import { RecentIdeaComponent } from './idea-main-page/recent-idea/recent-idea.component';
import { TopVotedIdeaComponent } from './idea-main-page/top-voted-idea/top-voted-idea.component';
import { UnderApprovalIdeaComponent } from './idea-main-page/under-approval-idea/under-approval-idea.component';
import { UnderEvaluationIdeaComponent } from './idea-main-page/under-evaluation-idea/under-evaluation-idea.component';
import { NotificationComponent } from './notification/notification.component';
import { OrganisationManageComponent } from './organisation-manage/organisation-manage.component';
import { OrganisationSettingComponent } from './organisation-setting/organisation-setting.component';
import { OrganisationComponent } from './organisation.component';
import { OrganisationMainRouteModule } from './organisationmain.routing';
import { PrivacyFormComponent } from './privacy-form/privacy-form.component';
import { CategoryGridComponent } from './standard-code/category-grid/category-grid.component';
import { DepartmentGridComponent } from './standard-code/department-grid/department-grid.component';
import { StandardCodeComponent } from './standard-code/standard-code.component';
import { TagGridComponent } from './standard-code/tag-grid/tag-grid.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserdetailComponent } from './userdetail/userdetail.component';
import { UserSelectFormComponent } from "./user-select-form/user-select-form.component";
import { CoverImagePopupComponent } from './userdetail/cover-image-popup/cover-image-popup.component';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  DevExtremeModule,
  DxDataGridModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxHtmlEditorModule,
  DxButtonGroupModule,
} from 'devextreme-angular';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgxEditorModule } from 'ngx-editor';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxTributeModule } from 'ngx-tribute';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { SafeHtmlPipe } from '../Pipe/safe-html.pipe'
import { StarRatingFormComponent } from './star-rating-form/star-rating-form.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UserFormComponent } from './user-form/user-form.component';
import { SingleRecentIdeaComponent } from './idea-main-page/recent-change-idea/single-recent-idea/single-recent-idea.component';
import { SingleTopVotedIdeaComponent } from './idea-main-page/top-voted-idea/single-top-voted-idea/single-top-voted-idea.component';
import { SingleJustApprovedIdeaComponent } from './idea-main-page/just-approved-idea/single-just-approved-idea/single-just-approved-idea.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilterIdeaPipe } from '../Pipe/filter-idea.pipe';
import { SingleIdeaCardComponent } from './idea-list/single-idea-card/single-idea-card.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { ConnectorsComponent } from './connectors/connectors.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { EventManagementService } from '../services/event-management.service';
import { SpmRedirectionComponent } from './spm-redirection/spm-redirection.component';
import { IdeaMainDetailsPageComponent } from './idea-main-page/idea-main-details-page/idea-main-details-page.component';

@NgModule({
  declarations: [
    OrganisationComponent,
    AllNotificationComponent,
    ApproverFormComponent,
    CommentFormComponent,
    CommentdislikedComponent,
    CommentlikedComponent,
    IdeaDetailComponent,
    IdeaFormComponent,
    IdeaListComponent,
    NotificationComponent,
    OrganisationManageComponent,
    OrganisationSettingComponent,
    PrivacyFormComponent,
    TeamFormComponent,
    UserListComponent,
    UserdetailComponent,
    UserSelectFormComponent,
    CoverImagePopupComponent,
    IdeaMainPageComponent,
    ApprovedIdeaComponent,
    FreshIdeaComponent,
    IdeaCardComponent,
    SingleIdeaComponent,
    JustApprovedIdeaComponent,
    MyInputIdeaComponent,
    MyReviewedIdeaComponent,
    RecentIdeaComponent,
    RecentChangeIdeaComponent,
    TopVotedIdeaComponent,
    UnderApprovalIdeaComponent,
    UnderEvaluationIdeaComponent,
    StandardCodeComponent,
    CategoryGridComponent,
    DepartmentGridComponent,
    TagGridComponent,
    SafeHtmlPipe,
    FilterIdeaPipe,
    StarRatingFormComponent,
    AddUserComponent,
    UpdateUserComponent,
    UserFormComponent,
    SingleRecentIdeaComponent,
    SingleTopVotedIdeaComponent,
    SingleJustApprovedIdeaComponent,
    SingleIdeaCardComponent,
    ConnectorsComponent,
    SpmRedirectionComponent,
    IdeaMainDetailsPageComponent,

  ],
  imports: [
    DevExtremeModule,
    DxDataGridModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    NgxCaptchaModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatChipsModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    DxHtmlEditorModule,
    DxButtonGroupModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    NgxEditorModule,
    NgbModule,
    MatInputModule,
    MatOptionModule,
    NgxTributeModule,
    MatSelectCountryModule.forRoot('de'),
    NgxFileDropModule,
    MatButtonToggleModule,
    RouterModule,
    OrganisationMainRouteModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  providers: [EventManagementService, DatePipe]
})
export class OrganisationMainModule { }
