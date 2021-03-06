import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  template: `
    <h1>
      {{title}}
    </h1>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'iSCAD+ Prototype';
}
