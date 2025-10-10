import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { StorageService } from './local-storage.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKey = 'users';
private platformId!: Object
  constructor(private http: HttpClient, private storage: StorageService, ) { }

  getUsers(): Observable<User[]> {
    const saved = this.storage.getItem(this.storageKey);
    if (saved) return of(JSON.parse(saved));


    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
      map(users => {
        this.storage.setItem(this.storageKey, JSON.stringify(users));
        return users;
      })
    );

  }

   saveUsers(users: User[]) {
    this.storage.setItem(this.storageKey, JSON.stringify(users));
  }

  addUser(user: User) {
    const users = JSON.parse(this.storage.getItem(this.storageKey) || '[]');
    users.push(user);
    this.saveUsers(users);
  }


    updateUser(user: User) {
    const users: User[] = JSON.parse(this.storage.getItem(this.storageKey) || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = user;
      this.saveUsers(users);
    }
  }

    deleteUser(id: number) {
    let users: User[] = JSON.parse(this.storage.getItem(this.storageKey) || '[]');
    users = users.filter(u => u.id !== id);
    this.saveUsers(users);
  }
}
