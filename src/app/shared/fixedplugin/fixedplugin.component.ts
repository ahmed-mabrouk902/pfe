import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'fixedplugin-cmp',
    templateUrl: 'fixedplugin.component.html'
})

export class FixedPluginComponent implements OnInit{

  public sidebarColor: string = "white";
  public body: string = "black";
  public sidebarActiveColor: string = "danger";

  public state: boolean = true;

        changeSidebarColor(color){//background
          var sidebar = <HTMLElement>document.querySelector('.sidebar');

          this.sidebarColor = color;
          if(sidebar != undefined){
              sidebar.setAttribute('data-color',color);
          }
        }

  changeSidebarActiveColor(color){//text
    var sidebar = <HTMLElement>document.querySelector('.sidebar');
    this.sidebarActiveColor = color;
    if(sidebar != undefined){
        sidebar.setAttribute('data-active-color',color);
    }
  }
  ngOnInit(){}
}
