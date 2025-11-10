import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TaskStatus } from '../../../model/tasks';
import { TasksService } from '../../../services/tasks.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-add.component',
  imports: [
    CommonModule,
    ButtonModule,
    TextareaModule,
    ReactiveFormsModule,
    InputTextModule,
    AutoCompleteModule,
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit {
  taskForm!: FormGroup;
  // task_statuses = Object.values(TaskStatus);
  ref!: DynamicDialogRef;
  task_statuses: { label: string; value: TaskStatus }[] = [];
  filteredStatuses: { label: string; value: TaskStatus }[] = [];
  get fc() {
    return this.taskForm.controls;
  }
  constructor(
    private fb: FormBuilder,
    private srv: TasksService,
    private MessageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.task_statuses = Object.values(TaskStatus).map((status) => ({
      label: status,
      value: status,
    }));
  }
  initForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      status: [TaskStatus.Pending],
    });
  }

  Submit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    } else {
      this.save();
    }
  }
  save() {
    // this.fc['status'].value== null ||this.fc['status'].value == '' ? this.fc['status'].setValue();
    console.log(this.taskForm.value, this.fc['status']);
    this.srv.addTask(this.taskForm.value).subscribe({
      next: (res: any) => {
        this.MessageService.add({
          severity: 'success',
          summary: '',
          detail: 'Add new Task  successfully',
        });
        this.ref.close();
      },
      error: (err: any) => {
        this.MessageService.add({
          severity: 'error',
          summary: '',
          detail: 'OOPS !!  error when saved new task  ',
        });
      },
    });
  }
  filterStatus(event: any) {
    const query = event.query.toLowerCase();
    this.filteredStatuses = this.task_statuses.filter((item) =>
      item.label.toLowerCase().includes(query)
    );
  }
}
