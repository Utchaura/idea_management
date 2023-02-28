import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopVotedIdeaComponent } from './top-voted-idea.component';

describe('TopVotedIdeaComponent', () => {
  let component: TopVotedIdeaComponent;
  let fixture: ComponentFixture<TopVotedIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopVotedIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopVotedIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
