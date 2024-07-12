import { Call } from 'app/call';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CallsService } from 'app/calls.service';
import { error } from 'console';
import { FileService } from 'app/file.service';
import { KeycloakService } from 'keycloak-angular';
import { Node } from 'app/node';



@Component({
    selector: 'calls',
    moduleId: module.id,
    templateUrl: 'calls.component.html',
    styleUrls: ['./calls.component.css']
})

export class CallsComponent implements OnInit {
    calls: Call[] = [];
    deleteId: string = "";
    type: string = "sync";
    id: number;
    api: string;
    topic: string;
    eventProduced: string;
    description: string;
    showAlert = false;
    errorUpdateCall = false;
    showDeleteAlert = false;
    errorLoading =false;
    errorDelete = false;
    errorExport=false;
    isAdmin: boolean;

constructor(private callsService: CallsService,private fileService: FileService ,private keycloakService: KeycloakService) { }
   
                      ngOnInit() {
                        const userRoles: string[] = this.keycloakService.getUserRoles();
                        this.isAdmin = userRoles.includes('admin');
                        

                         this.getAll();

                      }
  
              //update extraction
              public updateModel(id: number, type: string, api: string, topic: string, eventProduced: string, description: string): void {
                    document.getElementById('updateModel').style.display = 'block';
                    this.id = id;
                    this.type = type;
                    this.api = api;
                    this.topic = topic;
                    this.eventProduced = eventProduced;
                    this.description = description;
                }

              updateCall(): void {
                    const formData = new FormData();
                    formData.append("type", this.type);
                    if (this.type == 'sync') {
                      formData.append("api", this.api);
                    } else if (this.type == 'async') {
                      formData.append("topic", this.topic);
                      formData.append("eventProduced", this.eventProduced);
                    }
                    formData.append("description", this.description);
                  
                    this.callsService.updateCall(this.id, formData).subscribe({
                      next: (res) => {
                        document.getElementById('updateModel').style.display = 'none';
                        if (res != null) {
                          this.showAlert = true;
                          setTimeout(() => {
                            this.showAlert = false;
                          }, 1000);
                        } else {
                          this.errorUpdateCall = true;
                          setTimeout(() => {
                            this.errorUpdateCall = false;
                          }, 2000);
                        }
                  
                        this.callsService.getAllCalls().subscribe({
                          next: (response: Call[]) => {
                            this.calls = response;
                          },
                          error: (error) => {
                            this.errorLoading = true;
                          }
                        });
                      },
                      error: (error) => {
                        this.errorUpdateCall = true;
                        setTimeout(() => {
                          this.errorUpdateCall = false;
                        }, 2000);
                      }
                    });
                  }
      
    
    
    //to select when clicking
    public deleteModal(id: string): void {
      document.getElementById('id01').style.display = 'block';
      this.deleteId = id;
  }
  //while clicking delete
    public deleteCall(): void {
        document.getElementById('id01').style.display = 'none';
        this.callsService.deleteCall(this.deleteId).subscribe({
          next: () => {
            this.showDeleteAlert = true;
            setTimeout(() => {
              this.showDeleteAlert = false;
            }, 1000);
      
            this.callsService.getAllCalls().subscribe({
              next: (response: Call[]) => {
                this.calls = response;
                console.log("this is call:"+ this.calls);
              },
              error: (error) => {
                this.errorLoading = true;
              }
            });
          },
          error: () => {
            this.errorDelete = true;
          }
        });
      }
//all
      public deleteAllModal(): void {
        document.getElementById('deleteAllModal').style.display = 'block';
        
    }
      public deleteAll(): void {
        document.getElementById('deleteAllModal').style.display = 'none';
        this.callsService.deleteAll().subscribe({
          next: () => {
            this.showDeleteAlert = true;
            setTimeout(() => {
              this.showDeleteAlert = false;
            }, 1000);
      
            this.callsService.getAllCalls().subscribe({
              next: (response: Call[]) => {
                this.calls = response;
                console.log("this is call:"+ this.calls);
              },
              error: (error) => {
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

      //exporting Calls
    exportCalls() {
        this.fileService.exportCalls().subscribe(
            {
                next: ((response) => {
                    this.saveFile(response);
                  }),
                error: (({})=>{
                    this.errorExport = true;
                    setTimeout(() => {
                        this.errorExport = false;
                    }, 1000);
                })
                

            }
        )
        
        
      }
    
      private saveFile(data: Blob) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const saveas = require('file-saver');
        saveas.saveAs(blob, 'calls.xlsx');
      }



      
    //for table 
    searchText: string = '';
    sortBy: string = '';
  sortOrder: number = 1;
  callstemp: Call[] = [];
  getAll() {
    this.callsService.getAllCalls().subscribe({
      next: (data: Call[]) => {
        this.callstemp = data;
        this.calls = [...this.callstemp]; // Initialize calls with original data
      },
      error: (error) => {
        this.errorLoading = true;
      },
    });
  }
  
  sortItems(field: string): void {
    if (field === this.sortBy) {
      this.sortOrder *= -1; // Reverse sort order if same field is clicked again
    } else {
      this.sortBy = field; // Set new sort field
      this.sortOrder = 1; // Default ascending order
    }
    this.calls = this.sortNodes([...this.calls], this.sortBy, this.sortOrder); // Sort the current calls array
  }

  private sortNodes(items: Call[], field: string, order: number): Call[] {
    if (!items || !field) {
      return items;
    }

    return items.sort((a, b) => {
      const valueA = (a as any)[field];
      const valueB = (b as any)[field];

      if (valueA === undefined || valueB === undefined) {
        return 0;
      }

      if (valueA < valueB) {
        return -1 * order;
      } else if (valueA > valueB) {
        return 1 * order;
      } else {
        return 0;
      }
    });
  }
  filterItems(): void {
    if (!this.searchText.trim()) {
      // If search text is empty, show all calls
      this.calls = [...this.callstemp];
    } else {
      // Filter calls based on search text
      const searchTextLower = this.searchText.toLowerCase();
      this.calls = this.callstemp.filter((call) =>
        Object.values(call).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTextLower)
        )
      );
    }
  }

}
