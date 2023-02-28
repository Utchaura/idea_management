import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshIdeaComponent } from './fresh-idea.component';

describe('FreshIdeaComponent', () => {
  let component: FreshIdeaComponent;
  let fixture: ComponentFixture<FreshIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreshIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
