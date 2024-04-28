import { Component, OnInit } from '@angular/core';
import { AngularYandexMapsModule } from 'angular8-yandex-maps';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    NzButtonModule,
    FormsModule,
    NzFlexModule,
    NzSelectModule,
    NzDropDownModule,
    BaseChartDirective,
    CommonModule,
    AngularYandexMapsModule,
    NzGridModule,
    NzIconModule,
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(0,255,0,0.3)',
      },
    ],
  };
  sensor_options = [];

  currentHouseInfo: Placemark | undefined = undefined;

  

  getPlacemarkProperties(mark: Placemark) {
    let placemarkProperties: ymaps.IPlacemarkProperties = {
      hintContent: 'Нажмите для получения подробной информации',
      iconContent: this.getNearPlacemarks(mark).length.toString(), iconColor: '#00e000'
      
      // balloonContent: 'Baloon content',
    };
    return placemarkProperties;
  }
  mapsState: ymaps.IMapState = {
    controls: [],
  };
  myPos = [0, 0];

  currentFilter = 'all';

  placemarks_full: Placemark[] = [];
  placemarks: Placemark[] = [];
  placemarks_history: Placemark[] = [];

  onPlacemarkClick(mark: Placemark) {
    this.currentHouseInfo = mark;
    this.get_history(this.currentHouseInfo);
    this.history_to_dict()
  }

  constructor(private http: HttpClient) {
    navigator.geolocation.getCurrentPosition(
      (res) => {
        console.log(res.coords.latitude, res.coords.longitude);
        this.myPos = [res.coords.latitude, res.coords.longitude];
      },
      function () {
        console.log('error getting position');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );

    this.mapsState.controls = ['zoomControl'];
    this.http
      .get('http://127.0.0.1:8000/sensor_data')
      .subscribe((data: any) => {
        data = data.map((item: any) => {
          item.telemetry_timestamp = new Date(item.telemetry_timestamp);
          item.device_timestamp = new Date(item.device_timestamp);
          return item;
        });
        this.placemarks = data as Placemark[];
        console.log('placemarks: ', this.placemarks);
        this.getSensor_options();
      });
  }

  get_history(data: Placemark) {
    let history: Placemark[] = [];
    for (let mark of this.placemarks) {
      if (mark.device_name == data.device_name) {
        history.push(mark);
      }
    }
    this.placemarks_history = history;
  }
  history_to_dict() {
    let res = '';
    let sensor_keys: any = {};
    for (let mark of this.placemarks_history) {
      for (let sensor of mark.sensordatavalues) {
        if (!sensor_keys.hasOwnProperty(sensor.value_type)) {
          sensor_keys[sensor.value_type] = [sensor.value];
        } else {
          sensor_keys[sensor.value_type].push(sensor.value);
        }
      }
    }
    this.lineChartData.datasets = [];
    this.lineChartData.labels = [];
    for (let key in sensor_keys) {
      if (
        this.lineChartData.labels &&
        sensor_keys[key].length > this.lineChartData.labels.length
      ) {
        this.lineChartData.labels = [];
        console.log("LABELS",key)
        for (let i = 1; i < sensor_keys[key].length; i++) {
          this.lineChartData.labels.push('');
        }
      }
      this.lineChartData.datasets.push({
        data: sensor_keys[key],
        label: key,
        fill: true,
        tension: 0.5,
      });
    }
    return res;
  }
  changeFilter(event:any){
    console.error("search",event)
    if(this.placemarks_full.length == 0)
      this.placemarks_full = this.placemarks;
    this.placemarks = this.placemarks_full.filter((mark) => {
      return mark.sensordatavalues.some((sensor) => sensor.value_type == event)
    })
  }
  getNearPlacemarks(mark: Placemark) {
    let nearestPlacemarks: string[] = [];
    for (let mark2 of this.placemarks) {
      if (
        !nearestPlacemarks.includes(mark2.device_name) &&
        mark.location.latitude - mark2.location.latitude < 0.01 &&
        mark.location.longitude - mark2.location.longitude < 0.01
      ) {
        nearestPlacemarks.push(mark2.device_name);
      }
    }
    return nearestPlacemarks;
  }

  getSensor_options(){
    let sensor_keys: any = [];
    for (let mark of this.placemarks) {
      for (let sensor of mark.sensordatavalues) {
        if (!sensor_keys.includes(sensor.value_type)) {
          sensor_keys.push(sensor.value_type);
        }
      }
    }
    this.sensor_options = sensor_keys;
  }

  ngOnInit() {}
}

interface Placemark {
  location: { latitude: number; longitude: number };
  sensordatavalues: { value_type: string; value: number }[];
  telemetry_timestamp: Date;
  device_timestamp: Date;
  device_name: string;
  sensor_model: string;
}
