import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentlikedComponent } from './commentliked.component';

describe('CommentlikedComponent', () => {
  let component: CommentlikedComponent;
  let fixture: ComponentFixture<CommentlikedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentlikedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentlikedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
