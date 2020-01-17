import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModule } from '../../../app.module';
import { LoginModule } from '../login.module';
import { LoginPageComponent } from './login-page.component';

describe('LoginPage', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, LoginModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});