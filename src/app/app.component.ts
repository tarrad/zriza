import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  chart : any;
  constructor(private http: HttpClient) { }
  customers : any[] = [];
  ngOnInit(): void {
    
  }
  title = 'zriza';

  getUsers(): any
  {
    return this.http.get<any>("api/record/Project", {
      headers: {
          "Authorization": '96236a7b-7758-49e1-8475-0b6020755707',
          "tokenId": "96236a7b-7758-49e1-8475-0b6020755707",
      }
    });
  }



  clickMe()
  {
    this.getUsers().subscribe(
      res => {
        this.customers = res.data.Records;
        console.log(this.customers);
        var points = [];

    for (let entry of this.customers) {
      points.push({
        y : 5, 
        label: "dnnsjkfsdafsd"
      })
  }
     this.chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Basic Column Chart in Angular"
      },
      data: [{
        type: "column",
        
        dataPoints: points,
      }]
    });
      
    this.chart.render();
      }
    );
  }
}
