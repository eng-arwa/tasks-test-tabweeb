import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task, TaskStatus } from '../model/tasks';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasks = new BehaviorSubject<Task[]>([
    {
      id: 1,
      title: 'Project Setup',
      description: 'Initialize Angular workspace and dependencies.',
      status: TaskStatus.Pending,
    },
    {
      id: 2,
      title: 'Implement Task Model',
      description: 'Create Task interface and status enum.',
      status: TaskStatus.Completed,
    },
  ]);

  tasks$: Observable<Task[]> = this.tasks.asObservable();

  getAll(): Observable<Task[]> {
    return this.tasks$;
  }

  // Add a new task and return updated tasks as Observable
  addTask(task: Task): Observable<Task[]> {
    const updated = [...this.tasks.value, task];
    this.tasks.next(updated);
    return of(updated);
  }

  // Update task status and return updated tasks as Observable
  updateStatus(id: number, status: TaskStatus): Observable<Task[]> {
    const updated = this.tasks.value.map((task) => (task.id === id ? { ...task, status } : task));
    this.tasks.next(updated);
    return of(updated);
  }
}
