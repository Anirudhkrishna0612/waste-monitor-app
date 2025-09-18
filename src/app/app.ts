import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WasteService, WasteData } from './waste.service';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  // Signals for waste data
  recyclableWaste = signal(0);
  organicWaste = signal(0);
  hazardousWaste = signal(0);
  totalPoints = signal(0);

  // Store the latest waste data
  private wasteData: WasteData[] = [];

  // Modal state as a signal
  showModal = signal(false);

  // Chart configuration
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top', labels: { color: 'white' } },
      title: { display: true, text: 'Waste Breakdown (kg)', color: 'white', font: { size: 18 } }
    }
  };
  public pieChartData = computed<ChartConfiguration['data']>(() => ({
    labels: ['Recyclable', 'Organic', 'Hazardous'],
    datasets: [{
      data: [this.recyclableWaste(), this.organicWaste(), this.hazardousWaste()],
      backgroundColor: ['#10b981', '#facc15', '#ef4444'],
      borderColor: ['#0f766e', '#ca8a04', '#b91c1c'],
      borderWidth: 1
    }]
  }));
  public pieChartType: ChartConfiguration['type'] = 'pie';

  constructor(private wasteService: WasteService) {
    // Subscribe to Firestore data and update signals
    this.wasteService.getWasteData().subscribe((data: WasteData[]) => {
      this.wasteData = data;
      this.recyclableWaste.set(data.filter(d => d.type === 'recyclable').reduce((sum, d) => sum + (d.amount || 0), 0));
      this.organicWaste.set(data.filter(d => d.type === 'organic').reduce((sum, d) => sum + (d.amount || 0), 0));
      this.hazardousWaste.set(data.filter(d => d.type === 'hazardous').reduce((sum, d) => sum + (d.amount || 0), 0));
      this.totalPoints.set(data.reduce((sum, d) => sum + (d.points || 0), 0));
    });
  }

  // Get accuracy for a type
  getAccuracy(type: string): number {
    const item = this.wasteData.find(d => d.type === type);
    return item?.accuracy || 0;
  }

  // Get details for a type
  getDetails(type: string): string {
    const item = this.wasteData.find(d => d.type === type);
    return item?.details || 'N/A';
  }

  // Add waste (simulate ESP32)
  addWaste(type: 'recyclable' | 'organic' | 'hazardous') {
    const amounts = { recyclable: 5, organic: 3, hazardous: 0.5 };
    const points = { recyclable: 20, organic: 10, hazardous: 5 };
    this.wasteService.addWaste({ type, amount: amounts[type], points: points[type], accuracy: 90, details: `${type} sample`, userId: 'user1', timestamp: new Date() });
  }

  // Redeem points
  redeemPoints() {
    if (this.totalPoints() > 0) {
      this.showModal.set(true);
    } else {
      alert('No points to redeem!');
    }
  }

  confirmRedeem() {
    this.showModal.set(false);
    alert('🎉 Rewards redeemed! Check your email for vouchers.');
    this.wasteService.getWasteData().subscribe(data => {
      data.forEach(d => {
        if (d.id) {
          this.wasteService.updatePoints(d.id, 0);
        }
      });
    });
  }
}