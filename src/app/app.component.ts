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
  loading : boolean = false;
  ngOnInit(): void {

  }
  title = 'zriza';

  getProjects(): any
  {
    return this.http.get<any>("api/record/Project", {
      headers: {
          "Authorization": '96236a7b-7758-49e1-8475-0b6020755707',
          "tokenId": "96236a7b-7758-49e1-8475-0b6020755707",
      }
    });
  }

  getTasks(): any
  {
    return this.http.get<any>("api/record/Task", {
      headers: {
          "Authorization": '96236a7b-7758-49e1-8475-0b6020755707',
          "tokenId": "96236a7b-7758-49e1-8475-0b6020755707",
      }
    });
  }

  clickMeProfitPerProject()
  {
    this.getProjects().subscribe(
      res => {
        this.customers = res.data.Records;
        console.log(this.customers);
        var points = [];

    for (let entry of this.customers) {
      let profit = entry.budget - (entry.estimatedworktime * entry.pcfHourlyCost);
      points.push({
        y : profit,
        label: entry.projectname
      })
  }
     this.chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
  
      axisX:{
        labelFontSize:15,
        labelAngle: 75
      }, 
      title: {
        text: "Profits/Loss per project"
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


  clickMePercent()
  {
    this.loading = true;
    setTimeout(() =>{console.log(this.loading)},3500);
   
    console.log(this.loading);
   this.getTasks().subscribe(
    res => {
      this.customers = res.data.Records;
      console.log(this.customers);
      let totalTasksOfProject = new Map();
      let finishedTasksOfProject = new Map();

    for (let entry of this.customers) {

      if(totalTasksOfProject.has(entry.objecttitle) != false)
      {
        totalTasksOfProject.set(entry.objecttitle, totalTasksOfProject.get(entry.objecttitle) + 1);
      }
      else{
        totalTasksOfProject.set(entry.objecttitle,0);
      }

      if(finishedTasksOfProject.has(entry.objecttitle) != false)
      {
        if(entry.statuscode == 10)
        {
          finishedTasksOfProject.set(entry.objecttitle, finishedTasksOfProject.get(entry.objecttitle) + 1);
        }
      }
      else{
        finishedTasksOfProject.set(entry.objecttitle,0);
      }
    }

    this.getProjects().subscribe(
      res => {
        this.customers = res.data.Records;
        console.log(this.customers);
        var points = [];

    for (let entry of this.customers) {
      let numOfTotalTasks = totalTasksOfProject.get(entry.projectname);
      let numOfFinishedTasks = finishedTasksOfProject.get(entry.projectname);
      let percent = numOfFinishedTasks/numOfTotalTasks * 100;

      points.push({
        y : percent,
        label: entry.projectname
      })
    }
      this.chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Project tasks progress"
        },
        data: [{
          type: "column",

          dataPoints: points,
        }]
      });

      this.chart.render();
        }
      );
  });
  this.loading = false;
  }

  clickMeProfitPerClient()
  {
    this.getProjects().subscribe(
      res => {
        this.customers = res.data.Records;
        console.log(this.customers);
        var points = [];
        let profitByClient = new Map();

        for (let entry of this.customers) {
          let profit = entry.budget - (entry.estimatedworktime * entry.pcfHourlyCost);

          if(profitByClient.has(entry.accountidname) != false)
          {
            profitByClient.set(entry.accountidname, profitByClient.get(entry.accountidname) + profit);
          }
          else
          {
            profitByClient.set(entry.accountidname,0);
          }
        }

        for (let key of profitByClient.keys()) {
          points.push({
            y : profitByClient.get(key),
            label: key
          })
        }

        this.chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: "Profit/Loss per client"
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
