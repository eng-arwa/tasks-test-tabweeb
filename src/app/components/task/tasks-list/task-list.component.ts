import { Component, OnInit } from '@angular/core';
import { Task } from '../../../model/tasks';
import { TaskStatus } from '../../../model/tasks';
import { TasksService } from '../../../services/tasks.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { event } from '@primeuix/themes/aura/timeline';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddComponent } from '../add/add.component';

@Component({
  selector: 'app-task-list.component',
  imports: [
    ButtonModule,
    TableModule,
    CommonModule,
    SelectModule,
    MultiSelectModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    TagModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [DialogService, MessageService, ConfirmationService],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  TasksSttausList = TaskStatus;
  ref!: DynamicDialogRef | any;

  constructor(
    private srv: TasksService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {}

  columns: { field: string; header: string }[] = [
    { field: 'title', header: 'Title' },
    { field: 'description', header: 'Description' },
    { field: 'status', header: 'Status' },
  ];
  statuses: { label: string; value: TaskStatus }[] = [];

  loading: boolean = true;

  activityValues: number[] = [0, 100];
  globalFilterFields: any[] = [];
  ngOnInit() {
    this.subscribeData();
    this.prepareStatus();
  }
  filter(value: TaskStatus[], filterCallback: (value: any) => void) {
    filterCallback(value);
  }
  subscribeData() {
    this.srv.getAll().subscribe({
      next: (res: any) => {
        this.tasks = res;
        this.loading = false;
        this.tasks.forEach((task: any) => (task.date = new Date(<Date>task.date)));
        this.globalFilterFields = this.columns.map((c) => c.field);
      },
    });
  }

  prepareStatus() {
    this.statuses = Object.values(TaskStatus).map((status) => ({
      label: status,
      value: status,
    }));
  }
  add() {
    this.ref = this.dialogService.open(AddComponent, {
      header: 'create new Task ',
      width: '50vw',
      modal: true,
      closable: true,
    });
  }
  changeStatus(event: any, task: Task, status: any) {
    this.confirm(event, task, status);
  }
  clear(table: any) {
    table.clear();
  }
  confirm(event: Event, task: any, taskStatus: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        this.srv.updateStatus(task.id, taskStatus).subscribe({
          next: (res: any) => {
            this.tasks = res;
            this.messageService.add({
              severity: 'success',
              summary: '',
              detail: 'change status successfully',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'unqualified':
        return 'danger';

      case 'qualified':
        return 'success';

      case 'new':
        return 'info';

      case 'negotiation':
        return 'warn';

      case 'renewal':
        return null;
      default:
        return null;
    }
  }
}
