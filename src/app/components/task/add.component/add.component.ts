import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TaskStatus } from '../../../model/tasks';
import { TasksService } from '../../../services/tasks.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';
import { Toast } from 'primeng/toast';

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
  providers: [MessageService],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit {
  taskForm!: FormGroup;
  // task_statuses = Object.values(TaskStatus);
  data: any;

  task_statuses: { label: string; value: TaskStatus }[] = [];
  filteredStatuses: { label: string; value: TaskStatus }[] = [];
  get fc() {
    return this.taskForm.controls;
  }
  constructor(
    public ref: DynamicDialogRef,
    private fb: FormBuilder,
    private srv: TasksService,
    private MessageService: MessageService,
    public config: DynamicDialogConfig
  ) {
    config.data ? (this.data = config.data) : '';
  }

  ngOnInit() {
    this.initForm();
    this.prepareStatus();
    if (this.data) {
      this.taskForm.patchValue(this.data);
      this.taskForm.updateValueAndValidity();
    } else {
      this.taskForm.reset();
    }
  }

  prepareStatus() {
    this.task_statuses = Object.values(TaskStatus).map((status) => ({
      label: status,
      value: status,
    }));
  }
  initForm() {
    this.taskForm = this.fb.group({
      id: [],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      status: [TaskStatus.Pending],
    });
  }

  Submit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    } else if (this.data) {
      this.update();
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
  update() {
    console.log('sd', this.taskForm.value);
    this.srv.updateTask(this.taskForm.value).subscribe({
      next: (res: any) => {
        this.MessageService.add({
          severity: 'success',
          summary: '',
          detail: 'updated Task  successfully',
        });
        this.ref.close();
      },
      error: (err: any) => {
        this.MessageService.add({
          severity: 'error',
          summary: '',
          detail: 'OOPS !!  error when update this task  ',
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
