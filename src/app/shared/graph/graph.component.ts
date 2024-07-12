import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import NeoVis, { NeovisConfig } from 'neovis.js';

@Component({
    moduleId: module.id,
  selector: 'app-graph-visualization',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
    @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;
    private neoVis: NeoVis | null = null;
  
    constructor() {}
  
    ngOnInit(): void {
      this.initNeoVis();
    }
  
    ngOnDestroy(): void {
      if (this.neoVis) {
        this.neoVis.clearNetwork();
        this.neoVis = null;
      }
    }
  
    initNeoVis(): void {
      const config: NeovisConfig = {
        containerId: this.graphContainer.nativeElement.id,
        neo4j: {
          serverUrl: "bolt://localhost:7687",
          serverUser: "neo4j",
          serverPassword: "12345678"
        },
        visConfig: {
          nodes: {
            shape: 'dot',
            size: 15,
            font: {
              size: 12,
              color: '#000'
            },
            borderWidth: 2
          },
          edges: {
            width: 2,
            color: '#848484',
            arrows: {
              to: { enabled: true, scaleFactor: 1.2 }
            }
          }
        },
        labels: {
          MyNode: {
            label: "name",
            value: "pagerank",
            group: "community"
          }
        },
        relationships: {
          CALLS: {
            label:"type",
            value: "weight"
          }
        },
        initialCypher: "MATCH (n:MyNode)-[r:CALLS]->(m:MyNode) RETURN n,r,m"
      };
  
      this.neoVis = new NeoVis(config);
      this.neoVis.render();
      this.centerGraph();
    }
  
    centerGraph(): void {
      if (this.neoVis && this.neoVis.network) {
        this.neoVis.network.fit();
      }
    }
  
    changeCypherQuery(query: string): void {
      if (this.neoVis) {
        this.neoVis.clearNetwork();
        this.neoVis.updateWithCypher(query);
        this.centerGraph();
      }
    }
  
    showMatchedNodes(): void {
      this.changeCypherQuery('MATCH (n:MyNode)-[r:CALLS]->(m:MyNode) RETURN n,r,m');
    }
  
    showUnmatchedNodes(): void {
      this.changeCypherQuery('MATCH (n:MyNode) WHERE NOT (n)-[:CALLS]->() RETURN n');
    }
  
    onZoomChange(event: Event): void {
      const zoomLevel = (event.target as HTMLInputElement).valueAsNumber;
      if (this.neoVis) {
        (this.neoVis as any).network.moveTo({ scale: zoomLevel });
      }
    }
  
    
  }