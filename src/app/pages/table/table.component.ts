import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    NzTagModule,
    NzTableModule, 
    CommonModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  tableData: any[] = [];

  constructor(private http: HttpClient) {
    http.get("http://localhost:8000/sensor_table").subscribe((data: any) => {
      data.map((el: any) => {
        el.telemetry_timestamp = new Date(el.telemetry_timestamp);
      })
      this.tableData = data;
      console.log(this.tableData);
    })
  }

}
