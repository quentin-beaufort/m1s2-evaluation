import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Membre {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    editing?: boolean; // Pour activer/désactiver le mode édition
  }
  

@Injectable({ providedIn: 'root' })
export class MembreService {
  private apiUrl = 'http://212.83.130.191:3000/api/membres';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Membre[]> {
    return this.http.get<Membre[]>(this.apiUrl);
  }

  updateMembre(id: number, membre: Membre): Observable<Membre> {
    return this.http.put<Membre>(`${this.apiUrl}/${id}`, membre);
  }

  deleteMembre(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addMembre(membre: Membre): Observable<Membre> {
    return this.http.post<Membre>(this.apiUrl, membre);
  }
}
