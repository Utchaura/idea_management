import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationWelcomeComponent } from './organisation-welcome.component';

describe('OrganisationWelcomeComponent', () => {
  let component: OrganisationWelcomeComponent;
  let fixture: ComponentFixture<OrganisationWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationWelcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
