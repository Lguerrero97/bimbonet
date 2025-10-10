import { AfterViewInit, Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';
import { UserAdmin } from './core/models/user.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    MatButtonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    TranslateModule,
    MenubarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'Bimbonet';
  user: UserAdmin | null = null;

  currentLang = 'es';
  translatedLanguages: { code: string; label: string; flag: string }[] = [];

  languages = [
    { code: 'es', labelKey: 'HEADER.LANGUAGE.ES', flag: '🇲🇽' },
    { code: 'en', labelKey: 'HEADER.LANGUAGE.EN', flag: '🇺🇸' }
  ];

  mobileMenuOpen = false;
  menuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.addLangs(this.languages.map(l => l.code));
    this.translate.setFallbackLang('en');

    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang') || 'es';
      this.currentLang = savedLang;
      this.translate.use(savedLang);
    }

    this.updateTranslatedLanguages();

    this.translate.onLangChange.subscribe(() => this.updateTranslatedLanguages());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.user = this.authService.getCurrentUser();
    }, 1000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
    // Cargar Google Maps con el idioma seleccionado
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCEJvaZfQVcaGB1OkFGUT7QHVOFNRnXMsE&language=${lang}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  updateTranslatedLanguages() {
    this.translatedLanguages = this.languages.map(lang => ({
      code: lang.code,
      flag: lang.flag,
      label: this.translate.instant(lang.labelKey)
    }));
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
