import { Injectable } from '@angular/core';
import { keys } from './token';

@Injectable({
  providedIn: 'root',
})
export class Enviorment {
  public readonly MAPBOX_PUBLIC_KEY = keys.TokenJWT;
  constructor() {}
}
