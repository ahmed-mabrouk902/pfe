import { Component, OnInit } from '@angular/core';
import { Node } from 'app/node';
import { CallsService } from 'app/calls.service';
import { NodeService } from 'app/node.service';
import { error } from 'console';
import { FileService } from 'app/file.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'table-cmp',
    moduleId: module.id,
    templateUrl: 'nodes.component.html',
    styleUrls: ['./nodes.component.css']
})

export class NodesComponent implements OnInit {
    deleteName: string;
    nodes: Node[] = [];
    showAlert = false;
    errorLoading=false;
    errorDelete=false;
    errorExport=false;
    isAdmin: boolean;



    constructor(private nodeService: NodeService,private fileService : FileService ,private keycloakService: KeycloakService) {

    }
    ngOnInit() {
      const userRoles: string[] = this.keycloakService.getUserRoles();
      this.isAdmin = userRoles.includes('admin');
        this.nodeService.getAllNodes().subscribe({
          next: (res) => {
            this.nodes = res;
          },
          error: () => {
            this.errorLoading = true;
          }
        });
      }
      
      public deleteModel(name: string): void {
        document.getElementById('deleteModal').style.display = 'block';
        this.deleteName = name;
      }
      
      public deleteAllModel(): void {
        document.getElementById('deleteAllModal').style.display = 'block';
      }
      
      deleteNode() {
        document.getElementById('deleteModal').style.display = 'none';
        this.nodeService.deleteNode(this.deleteName).subscribe({
          next: () => {
            this.showAlert = true;
            setTimeout(() => {
              this.showAlert = false;
            }, 1000);
      
            this.nodeService.getAllNodes().subscribe({
              next: (res) => {
                this.nodes = res;
              },
              error: () => {
                this.errorLoading = true;
              }
            });
          },
          error: () => {
            this.errorDelete = true;
            setTimeout(() => {
              this.errorDelete = false;
            }, 1000);
          }
        });
      }
      
      deleteAll() {
        document.getElementById('deleteAllModal').style.display = 'none';
        this.nodeService.deleteAll().subscribe({
          next: () => {
            this.showAlert = true;
            setTimeout(() => {
              this.showAlert = false;
            }, 1000);
      
            this.nodeService.getAllNodes().subscribe({
              next: (res) => {
                this.nodes = res;
              },
              error: () => {
                this.errorLoading = true;
              }
            });
          },
          error: () => {
            this.errorDelete = true;
            setTimeout(() => {
              this.errorDelete = false;
            }, 1000);
          }
        });
      }
      
      exportNodes() {
        this.fileService.exportNodes().subscribe({
          next: (response) => {
            this.saveFile(response);
          },
          error: () => {
            this.errorExport = true;
            setTimeout(() => {
              this.errorExport = false;
            }, 1000);
          }
        });
      }
      
      private saveFile(data: Blob) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const saveas = require('file-saver');
        saveas.saveAs(blob, 'nodes.xlsx');
      }
}
