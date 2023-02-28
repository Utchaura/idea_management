import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedIdeaComponent } from './approved-idea.component';

describe('ApprovedIdeaComponent', () => {
  let component: ApprovedIdeaComponent;
  let fixture: ComponentFixture<ApprovedIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
