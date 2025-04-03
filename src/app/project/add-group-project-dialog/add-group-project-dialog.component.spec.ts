import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupProjectDialogComponent } from './add-group-project-dialog.component';

describe('AddGroupProjectDialogComponent', () => {
  let component: AddGroupProjectDialogComponent;
  let fixture: ComponentFixture<AddGroupProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGroupProjectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
