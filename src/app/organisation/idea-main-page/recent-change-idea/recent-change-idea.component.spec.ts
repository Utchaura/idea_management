import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentChangeIdeaComponent } from './recent-change-idea.component';

describe('RecentChangeIdeaComponent', () => {
  let component: RecentChangeIdeaComponent;
  let fixture: ComponentFixture<RecentChangeIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentChangeIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentChangeIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
