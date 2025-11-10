import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from '../../components/home/home';

const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'status',
    loadComponent: () =>
      import('../../components/status/status-list/status-list.component').then(
        (m) => m.StatusListComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('../../components/task/tasks-list/task-list.component').then(
        (m) => m.TaskListComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
