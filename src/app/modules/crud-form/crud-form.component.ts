import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { GoogleMapsModule } from '@angular/google-maps';
import { InputMaskModule } from 'primeng/inputmask';
import { User } from '../../core/models/user.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-crud-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    GoogleMapsModule,
    InputMaskModule,
    TranslateModule
  ],
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss']
})
export class CrudFormComponent implements OnInit {
  @Input() visible = false;
  @Input() user!: User;
  @Input() mode: 'add' | 'edit' | 'detail' = 'detail';
  @Output() close = new EventEmitter<User | null>();

  userForm: FormGroup;

  zoom = 13;
  center: google.maps.LatLngLiteral = { lat: 19.4326, lng: -99.1332 };
  markerPosition: google.maps.LatLngLiteral = { lat: 19.4326, lng: -99.1332 };
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  mapOptions: google.maps.MapOptions = {
    draggable: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    clickableIcons: true
  };

  private geocoder = new google.maps.Geocoder();

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      extension: ['', [Validators.pattern(/^\d*$/)]], // campo de extensión
      website: [''],
      company: this.fb.group({ name: [''] }),
      address: this.fb.group({
        street: [''],
        suite: [''],
        city: [''],
        zipcode: ['', [Validators.pattern(/^$|^\d{5,}$/)]],
        geo: this.fb.group({
          lat: ['19.4326', Validators.required],
          lng: ['-99.1332', Validators.required]
        })
      }),
      destacado: [false]
    });
  }

  ngOnInit(): void {
    if (this.user) this.initializeForm();

    // sincronización mapa y coordenadas
    const geoGroup = this.userForm.get('address.geo')!;
    geoGroup.valueChanges.subscribe((value: any) => {
      const lat = parseFloat(value.lat);
      const lng = parseFloat(value.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        this.markerPosition = { lat, lng };
        this.center = { lat, lng };
        this.updateAddressFromCoordinates(lat, lng);
      }
    });

    // sincronización inputs dirección Y mapa (geocoding directo)
    const addressGroup = this.userForm.get('address')!;
    addressGroup.valueChanges.subscribe((value) => {
      if (this.mode === 'detail') return;
      const fullAddress = `${value.street || ''} ${value.suite || ''}, ${value.city || ''}, ${value.zipcode || ''}`;
      if (fullAddress.trim() === '') return;

      this.geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          this.userForm.get('address.geo')?.patchValue({ lat, lng }, { emitEvent: false });
          this.center = { lat, lng };
          this.markerPosition = { lat, lng };
        }
      });
    });
  }

  private initializeForm(): void {
    const lat = parseFloat(this.user.address?.geo?.lat || '19.4326');
    const lng = parseFloat(this.user.address?.geo?.lng || '-99.1332');

    // Separar teléfono y extensión
    let phone = this.user.phone || '';
    let digits = phone.replace(/\D/g, '');
    let extension = '';
    const extMatch = phone.match(/x(\d+)$/i);
    if (extMatch) {
      extension = extMatch[1];
      digits = digits.slice(0, 10); // solo los primeros 10 dígitos para el formato
    }

    this.userForm.patchValue({
      name: this.user.name,
      username: this.user.username,
      email: this.user.email,
      phone: digits.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3'),
      extension: extension,
      website: this.user.website,
      company: { name: this.user.company?.name || '' },
      address: {
        street: this.user.address?.street || '',
        suite: this.user.address?.suite || '',
        city: this.user.address?.city || '',
        zipcode: this.user.address?.zipcode.replace(/\D/g, '') || '',
        geo: { lat, lng }
      },
      destacado: this.user.destacado || false
    });

    this.center = { lat, lng };
    this.markerPosition = { lat, lng };
    this.applyModeSettings();
  }

  private applyModeSettings(): void {
    const isDetail = this.mode === 'detail';
    if (isDetail) this.userForm.disable();
    else this.userForm.enable();

    this.markerOptions.draggable = !isDetail;
    this.mapOptions = {
      draggable: !isDetail,
      scrollwheel: !isDetail,
      disableDoubleClickZoom: isDetail,
      clickableIcons: !isDetail
    };
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (!event.latLng || this.mode === 'detail') return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    this.userForm.get('address.geo')?.patchValue({ lat, lng });
  }

  onMarkerDragEnd(event: any): void {
    if (!event.latLng || this.mode === 'detail') return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    this.userForm.get('address.geo')?.patchValue({ lat, lng });
  }

  private updateAddressFromCoordinates(lat: number, lng: number) {
    this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const components: any = { street: '', suite: '', city: '', zipcode: '' };
        results[0].address_components.forEach((c) => {
          if (c.types.includes('street_number')) components.suite = c.long_name;
          if (c.types.includes('route')) components.street = c.long_name;
          if (c.types.includes('locality')) components.city = c.long_name;
          if (c.types.includes('postal_code')) components.zipcode = c.long_name;
        });
        this.userForm.get('address')?.patchValue(components, { emitEvent: false });
      }
    });
  }

  save(): void {
    if (this.userForm.invalid) return;
    const f = this.userForm.value;

    // Combinar teléfono + extensión
    const phone = f.phone.replace(/\D/g, ''); // solo dígitos
    const ext = f.extension ? ` x${f.extension}` : '';
    const fullPhone = phone.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3') + ext;

    const updatedUser: User = {
      ...this.user,
      name: f.name,
      username: f.username,
      email: f.email,
      phone: fullPhone,
      website: f.website,
      company: { ...f.company },
      address: { ...f.address },
      destacado: f.destacado,
      checked: this.user?.checked
    };
    this.close.emit(updatedUser);
  }

  cancel(): void {
    this.close.emit(null);
  }
}
