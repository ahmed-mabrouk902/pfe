import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';






import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CallsComponent } from 'app/pages/calls/calls.component';
import { AddCallComponent } from 'app/pages/add-call/add-call.component';
import { NodesComponent } from 'app/pages/nodes/nodes.component';
import { AddNodeComponent } from 'app/pages/add-node/add-node.component';
import{MatInputModule}from "@angular/material/input"
import{MatAutocompleteModule}from "@angular/material/autocomplete"
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
   
  ],
  declarations: [
    CallsComponent,
 
    AddCallComponent,
    NodesComponent,
    AddNodeComponent
    
 
  ]
})

export class AdminLayoutModule {}
