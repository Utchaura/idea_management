import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationManageComponent } from './organisation-manage.component';

describe('OrganisationManageComponent', () => {
  let component: OrganisationManageComponent;
  let fixture: ComponentFixture<OrganisationManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
