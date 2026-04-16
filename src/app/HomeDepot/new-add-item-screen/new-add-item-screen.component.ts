import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SafePipe } from '../../safe.pipe';

@Component({
  selector: 'app-new-add-item-screen',
  standalone: true,
  imports: [RouterLink, RouterOutlet, SafePipe],
  templateUrl: './new-add-item-screen.component.html',
  styleUrl: './new-add-item-screen.component.scss'
})
export class NewAddItemScreenComponent {

  externalUrl = 'https://www.homedepot.com/s/045242556519';

  openAndReceive() {
  const win = window.open('https://www.homedepot.com/s/045242556519', '_blank');

}

}

