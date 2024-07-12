import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphComponent } from './graph.component';

@NgModule({
    imports: [ RouterModule, CommonModule, NgbModule ],
    declarations: [ GraphComponent ],
    exports: [ GraphComponent ]
})

export class GraphModule {}
