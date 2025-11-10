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
    {
      id: 3,
      title: 'Create Components',
      description: 'Generate header, footer, and dashboard components.',
      status: TaskStatus.InProgress,
    },
    {
      id: 4,
      title: 'Setup Routing',
      description: 'Configure Angular Router and lazy loading modules.',
      status: TaskStatus.Pending,
    },
    {
      id: 5,
      title: 'Build Services',
      description: 'Implement API services to fetch tasks and users.',
      status: TaskStatus.InProgress,
    },
    {
      id: 6,
      title: 'Form Validation',
      description: 'Add reactive forms with validation for task creation.',
      status: TaskStatus.Pending,
    },
    {
      id: 7,
      title: 'Unit Testing',
      description: 'Write unit tests for components and services.',
      status: TaskStatus.Pending,
    },
    {
      id: 8,
      title: 'Integrate State Management',
      description: 'Use BehaviorSubject to manage tasks state globally.',
      status: TaskStatus.InProgress,
    },
    {
      id: 9,
      title: 'Styling & Theming',
      description: 'Apply SCSS styles and theming to the application.',
      status: TaskStatus.Completed,
    },
    {
      id: 10,
      title: 'Final Deployment',
      description: 'Build and deploy the Angular app to production.',
      status: TaskStatus.Pending,
    },
  ]);

  tasks$: Observable<Task[]> = this.tasks.asObservable();

  getAll(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Partial<Task>): Observable<Task[]> {
    const newId =
      this.tasks.value.length > 0 ? Math.max(...this.tasks.value.map((t) => t.id)) + 1 : 1;
    const newTask: Task = {
      id: newId,
      status: task.status ?? TaskStatus.Pending,
      title: task.title ?? '',
      description: task.description ?? '',
    };

    const updatedTasks = [...this.tasks.value, newTask];
    this.tasks.next(updatedTasks);

    return of(updatedTasks);
  }

  updateStatus(id: number, status: TaskStatus): Observable<Task[]> {
    const updatedTasks = this.tasks.value.map((task) =>
      task.id === id ? { ...task, status } : task
    );
    this.tasks.next(updatedTasks);
    return of(updatedTasks);
  }

  updateTask(updatedTask: Task): Observable<Task[]> {
    if (updatedTask.id == null) {
      throw new Error('Cannot update task without an ID');
    }

    const updatedTasks = this.tasks.value.map((task) =>
      task.id === updatedTask.id ? { ...task, ...updatedTask } : task
    );

    this.tasks.next(updatedTasks);
    return of(updatedTasks);
  }
}
