import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInputIdeaComponent } from './my-input-idea.component';

describe('MyInputIdeaComponent', () => {
  let component: MyInputIdeaComponent;
  let fixture: ComponentFixture<MyInputIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyInputIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInputIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
