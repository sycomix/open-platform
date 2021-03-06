import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface ILogIn {
  email: string;
  password: string;
}

@Component({
  selector: 'ten-login-form',
  templateUrl: 'login-form.component.html',
})
export class LoginFormComponent implements OnInit {
  @Output() public logIn = new EventEmitter<ILogIn>();

  public error: string;
  public form: FormGroup;

  public ngOnInit() {
    this.setupForm();
  }

  public submit() {
    if (this.form.invalid) {
      this.form.get('email').markAsTouched();
      this.form.get('password').markAsTouched();

      return;
    }

    const values = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    };
    this.logIn.emit(values);
  }

  private setupForm(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });

    this.form.valueChanges.subscribe(data => {
      this.error = null;
    });
  }
}
