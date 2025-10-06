import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { StorageService } from '../../core/services/local-storage.service';
import { User, UserAdmin } from '../../core/models/user.model';
import { CrudFormComponent } from '../crud-form/crud-form.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    CheckboxModule,
    CrudFormComponent,
    TranslateModule,
    RippleModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService, ConfirmationService]

})
export class DashboardComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];
  loading = true;

  globalFilter = '';

  showModal = false;
  modalMode: 'add' | 'edit' | 'detail' = 'detail';
  selectedUser!: User;

  canAdd = false;
  canEdit = false;
  canDelete = false;

  pageIndex = 0;
  pageSize = 5;
  constructor(
    private authService: AuthService,
    private usersService: UserService,
    private storageService: StorageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService

  ) { }

  ngOnInit(): void {
    this.loadPermissions();
    this.loadUsers();
  }

  private loadPermissions(): void {
    const user: UserAdmin | null = this.authService.getCurrentUser();
    const role = user?.role?.toLowerCase();
    this.canAdd = role === 'manager' || role === 'coordinator';
    this.canEdit = role === 'manager';
    this.canDelete = role === 'manager';
  }

  private loadUsers(): void {
    const saved = this.storageService.getItem('users');
    if (saved) {
      this.users = JSON.parse(saved);
      this.filteredUsers = [...this.users];
      this.loading = false;
    } else {
      this.usersService.getUsers().subscribe({
        next: (data: User[]) => {
          this.users = data.map(u => ({ ...u, destacado: false }));
          this.filteredUsers = [...this.users];
          this.loading = false;
          this.storageService.setItem('users', JSON.stringify(this.users));
        },
        error: (err) => {
          console.error('Error al cargar usuarios:', err);
          this.loading = false;
        }
      });
    }
  }

  private saveUsers(): void {
    this.storageService.setItem('users', JSON.stringify(this.users));
  }

  toggleDestacado(user: User | User[]): void {
    if (Array.isArray(user)) {
      user.forEach(u => u.destacado = !u.destacado);
    } else {
      user.destacado = !user.destacado;
    }
    this.saveUsers();
  }

  applyFilter(): void {
    const filter = this.globalFilter.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(filter) ||
      user.username.toLowerCase().includes(filter) ||
      user.email.toLowerCase().includes(filter) ||
      user.phone.toLowerCase().includes(filter) ||
      user.website.toLowerCase().includes(filter) ||
      user.company?.name.toLowerCase().includes(filter) ||
      user.address?.city.toLowerCase().includes(filter)
    );
    this.pageIndex = 0;
  }

  openModal(mode: 'add' | 'edit' | 'detail', user: User | null = null): void {
    this.modalMode = mode;
    this.selectedUser = user
      ? { ...user }
      : {} as User;
    this.showModal = true;
  }

  closeModal(updatedUser: User | null): void {
    if (updatedUser) {
      if (this.modalMode === 'add') {
        updatedUser.id = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
        this.users.push(updatedUser);
        this.messageService.add({ severity: 'success', summary: this.translate.instant('CRUD.SUCCESS'), detail: this.translate.instant('CRUD.USER_CREATE'), life: 3000 });

      } else if (this.modalMode === 'edit') {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        this.messageService.add({ severity: 'success', summary: this.translate.instant('CRUD.SUCCESS'), detail: this.translate.instant('CRUD.USER_UPDATE'), life: 3000 });
        if (index !== -1) this.users[index] = updatedUser;
      }
      this.saveUsers();
      this.applyFilter();
    }
    this.showModal = false;
  }

  deleteUser(user: User | User[], res: any, isArray: any): void {
    let wasDeleted = false;
    if (!this.canDelete) return;

    if (Array.isArray(user)) {
      if (user.length > 0) {
        const idsToDelete = user.map(u => u.id);
        this.users = this.users.filter(u => !idsToDelete.includes(u.id));
        wasDeleted = true;
      }
    } else {
      this.users = this.users.filter(u => u.id !== user.id);
      wasDeleted = true;

    }
    this.saveUsers();
    this.applyFilter();
    if (wasDeleted) {
      this.messageService.add({
        severity: 'success',
        summary: res['COMMON.SUCCESS'],
        detail: isArray ? res['DASHBOARD.MSJ_DELETE_SUCCES_ARRAY'] : res['DASHBOARD.MSJ_DELETE_SUCCES'],
        life: 2500
      });
    }
  }


  confirmDelete(user: User | User[]) {
    const isArray = Array.isArray(user);

    this.translate.get([
      isArray ? 'DASHBOARD.MSJ_DELETE_CONFIRM_ARRAY' : 'DASHBOARD.MSJ_DELETE_CONFIRM',
      isArray ? 'DASHBOARD.MSJ_DELETE_SUCCES_ARRAY' : 'DASHBOARD.MSJ_DELETE_SUCCES',
      'COMMON.TITLE_CONFIRM', 'COMMON.YES', 'COMMON.NO', 'COMMON.SUCCESS'
    ]).subscribe((res) => {
      this.confirmationService.confirm({
        message: isArray ? res['DASHBOARD.MSJ_DELETE_CONFIRM_ARRAY'] : res['DASHBOARD.MSJ_DELETE_CONFIRM'],
        header: res['COMMON.TITLE_CONFIRM'],
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: res['COMMON.YES'],
        rejectLabel: res['COMMON.NO'],
        acceptButtonStyleClass: 'p-button-danger p-button-rounded',
        rejectButtonStyleClass: 'p-button-secondary p-button-rounded',
        accept: () => {
          this.deleteUser(user, res, isArray);
        }
      });
    });

  }
}