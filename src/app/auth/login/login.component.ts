import { CommonModule } from '@angular/common';
import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    TranslateModule,
    MatProgressSpinnerModule,
    RippleModule,
    ToastModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]

})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error = '';
  isLoading = true;

  constructor(private fb: FormBuilder, public authService: AuthService, private router: Router, private messageService: MessageService, private translate: TranslateService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
  ngOnInit(): void {
    this.authService.logout()
  }

  submit() {
    if (this.loginForm.invalid) return;
    const { username, password } = this.loginForm.value;
    this.isLoading = true;
    this.authService.login(username, password).subscribe(user => {
      if (user) {
        this.showMensage('success', 'Success', this.translate.instant('HEADER.MSJ_SUCCES_LOGIN'));
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        }, 1000);
      } else {
        this.isLoading = false;
        this.showMensage('error', 'Error', this.translate.instant('HEADER.MSJ_ERROR_LOGIN'));
      }
    });
  }

  showMensage(severity: string, summary: string, info: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: info, life: 3000 });
  }
}
