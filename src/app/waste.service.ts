import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface WasteData {
  id?: string;
  type: 'recyclable' | 'organic' | 'hazardous';
  amount: number;
  points: number;
  timestamp: Date;
  accuracy?: number;
  details?: string;
  userId?: string;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WasteService {
  private wasteCollection: any;

  constructor(private firestore: Firestore) {
    this.wasteCollection = collection(this.firestore, 'waste');
  }

  // Fetch all waste data
  getWasteData(): Observable<WasteData[]> {
    return collectionData(this.wasteCollection, { idField: 'id' }) as Observable<WasteData[]>;
  }

  // Add new waste entry (simulates ESP32)
  addWaste(data: Omit<WasteData, 'id'>): Promise<any> {
    return addDoc(this.wasteCollection, { ...data, timestamp: new Date() });
  }

  // Update points for an entry
  updatePoints(id: string, points: number): Promise<void> {
    const wasteDoc = doc(this.firestore, `waste/${id}`);
    return updateDoc(wasteDoc, { points });
  }
}