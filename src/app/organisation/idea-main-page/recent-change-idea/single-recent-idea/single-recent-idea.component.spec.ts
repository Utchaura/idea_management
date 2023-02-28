import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRecentIdeaComponent } from './single-recent-idea.component';

describe('SingleRecentIdeaComponent', () => {
  let component: SingleRecentIdeaComponent;
  let fixture: ComponentFixture<SingleRecentIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleRecentIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRecentIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
