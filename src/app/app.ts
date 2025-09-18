import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div class="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg text-white text-center">
        <h1 class="text-4xl font-bold mb-4 text-emerald-400">Angular Starter</h1>
        <p class="text-gray-300 mb-6">This is a single-file Angular app. Edit this file to build your project!</p>
        
        <div class="bg-gray-700 p-6 rounded-lg mb-6">
          <p class="text-lg font-medium text-emerald-300">A simple signal counter:</p>
          <div class="flex items-center justify-center mt-2 space-x-4">
            <button (click)="decrement()" class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition-colors duration-200">
              -
            </button>
            <span class="text-3xl font-mono text-emerald-400">{{ counter() }}</span>
            <button (click)="increment()" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-md transition-colors duration-200">
              +
            </button>
          </div>
          <p class="text-sm text-gray-400 mt-2">The counter is {{ isEven() ? 'even' : 'odd' }}.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
    :host {
      font-family: 'Inter', sans-serif;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  counter = signal(0);
  isEven = computed(() => this.counter() % 2 === 0);

  increment() {
    this.counter.update(value => value + 1);
  }

  decrement() {
    this.counter.update(value => value - 1);
  }
}
