import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaMainDetailsPageComponent } from './idea-main-details-page.component';

describe('IdeaMainDetailsPageComponent', () => {
  let component: IdeaMainDetailsPageComponent;
  let fixture: ComponentFixture<IdeaMainDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdeaMainDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeaMainDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
