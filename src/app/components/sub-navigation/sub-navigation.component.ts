import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  link: string;
  badge?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-sub-navigation',
  templateUrl: './sub-navigation.component.html',
  styleUrls: ['./sub-navigation.component.css']
})
export class SubNavigationComponent implements OnInit {
  currentRoute: string = '';
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', link: '/', badge: 5 },
    { label: 'Projects', icon: 'folder', link: '/project', badge: 12 },
    { label: 'Tasks', icon: 'task', link: '/task', badge: 8 },
    { label: 'Reports', icon: 'assessment', link: '/report' },
    { label: 'Settings', icon: 'settings', link: '/settings' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
      this.updateActiveState();
    });
  }

  private updateActiveState(): void {
    this.menuItems = this.menuItems.map(item => ({
      ...item,
      isActive: this.currentRoute.startsWith(item.link)
    }));
  }
} 