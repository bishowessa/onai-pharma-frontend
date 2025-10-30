import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PromoteUserComponent } from './promote-user.component';

describe('PromoteUserComponent', () => {
  let component: PromoteUserComponent;
  let fixture: ComponentFixture<PromoteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoteUserComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
