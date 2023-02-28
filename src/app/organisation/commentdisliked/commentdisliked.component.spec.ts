import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentdislikedComponent } from './commentdisliked.component';

describe('CommentdislikedComponent', () => {
  let component: CommentdislikedComponent;
  let fixture: ComponentFixture<CommentdislikedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentdislikedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentdislikedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
