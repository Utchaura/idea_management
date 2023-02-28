import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustApprovedIdeaComponent } from './just-approved-idea.component';

describe('JustApprovedIdeaComponent', () => {
  let component: JustApprovedIdeaComponent;
  let fixture: ComponentFixture<JustApprovedIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustApprovedIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JustApprovedIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
