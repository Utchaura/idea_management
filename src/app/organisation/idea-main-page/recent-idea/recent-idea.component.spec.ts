import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentIdeaComponent } from './recent-idea.component';

describe('RecentIdeaComponent', () => {
  let component: RecentIdeaComponent;
  let fixture: ComponentFixture<RecentIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
