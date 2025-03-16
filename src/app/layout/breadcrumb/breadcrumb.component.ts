import { Component, OnInit, Input } from '@angular/core';
import { BreadcrumbInterface } from '../../interfaces/breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumbs: BreadcrumbInterface[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
