import { AuthService } from './../../../_modules/home/pages/seguranca/auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() user=true;
  @Input() nomeFuncionario: string;
  @Input() imagem: string;

  constructor(public service: AuthService) { }

  ngOnInit(): void {
  }

}
