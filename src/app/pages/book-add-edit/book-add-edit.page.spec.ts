import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookAddEditPage } from './book-add-edit.page';

describe('BookAddEditPage', () => {
  let component: BookAddEditPage;
  let fixture: ComponentFixture<BookAddEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAddEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
