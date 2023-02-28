import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTopVotedIdeaComponent } from './single-top-voted-idea.component';

describe('SingleTopVotedIdeaComponent', () => {
  let component: SingleTopVotedIdeaComponent;
  let fixture: ComponentFixture<SingleTopVotedIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTopVotedIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTopVotedIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
