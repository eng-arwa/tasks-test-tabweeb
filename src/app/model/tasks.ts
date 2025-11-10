export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}
