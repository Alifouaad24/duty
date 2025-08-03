import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-screen-for-maim',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './main-screen-for-maim.component.html',
  styleUrl: './main-screen-for-maim.component.scss'
})
export class MainScreenForMaimComponent {


}
