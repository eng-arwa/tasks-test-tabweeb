import { Component } from '@angular/core';
import { HomeRoutingModule } from '../../modules/home/home-routing-module';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private router: Router, private route: ActivatedRoute) {}
  navigateTo(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
  }
}
