import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserAdmin } from '../models/user.model';
import { Observable, map } from 'rxjs';
import { StorageService } from './local-storage.service';
import { Role } from '../models/role.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: UserAdmin | null = null;

  constructor(private http: HttpClient, private storage: StorageService) { }

  login(username: string, password: string): Observable<UserAdmin | null> {
    return this.http.get<UserAdmin[]>('assets/users.json').pipe(
      map(usersAdmin => {
        let existUsers = this.storage.getItem<UserAdmin>('adminUsers');
        if (!existUsers) {
          this.storage.setItem('adminUsers', usersAdmin);
        }
        const userAdmin = usersAdmin.find(u => u.username === username && u.password === password) || null;
        if (userAdmin) {
          this.currentUser = userAdmin;
          this.storage.setItem('currentUser', userAdmin);
        }
        return userAdmin;
      })
    );
  }

  logout() {
    this.currentUser = null;
    this.storage.removeItem('currentUser');
  }

  getCurrentUser(): UserAdmin | null {
    if (!this.currentUser) {
      this.currentUser = this.storage.getItem<UserAdmin>('currentUser');
    }
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  getRole(): Role | null {
    return this.currentUser?.role ?? null;
  }
}
