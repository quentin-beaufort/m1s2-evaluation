import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  id?: number;
  text: string;
  completed: boolean;
  editing: boolean;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  // private apiUrl = 'http://212.83.130.191:3000/api/tasks';
  private apiUrl = 'http://127.0.0.1:3000/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getCompletedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/completed`);
  }

  getRemainingTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/remaining`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, {withCredentials: true});
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task,{withCredentials : true});
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{withCredentials: true});
  }
}
