import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaMainPageComponent } from './idea-main-page.component';

describe('IdeaMainPageComponent', () => {
  let component: IdeaMainPageComponent;
  let fixture: ComponentFixture<IdeaMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdeaMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeaMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
