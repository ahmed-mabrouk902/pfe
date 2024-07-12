import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import NeoVis from 'neovis.js';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  currentUrl: string = ''; // Variable to hold the current URL
test: boolean=true;
  constructor(private router: Router) {
    // Initialize currentUrl with the initial URL
    this.currentUrl = this.router.url;

    // Subscribe to NavigationEnd events to update currentUrl
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        console.log('Current URL:', this.currentUrl); // Log the current URL whenever it changes
        if(this.currentUrl=="/addNode"||this.currentUrl=="/addCall"){
          this.test=false;

          
        }else{
          this.test=true;
        }
      }
    });
  }
}
