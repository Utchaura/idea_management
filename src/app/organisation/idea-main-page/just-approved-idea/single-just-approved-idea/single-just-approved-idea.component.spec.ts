import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleJustApprovedIdeaComponent } from './single-just-approved-idea.component';

describe('SingleJustApprovedIdeaComponent', () => {
  let component: SingleJustApprovedIdeaComponent;
  let fixture: ComponentFixture<SingleJustApprovedIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleJustApprovedIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleJustApprovedIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
