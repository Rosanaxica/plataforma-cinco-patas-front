import { EnderecoRepository } from './../../../../_core/repository/endereco-repository ';
import { PessoaDataService } from './../../../../_services/pessoa-data.service';
import { PessoaModel } from './../../../../_core/model/pessoa-model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cadastro-adotante-endereco',
  templateUrl: './cadastro-adotante-endereco.component.html',
  styleUrls: ['./cadastro-adotante-endereco.component.css'],
})
export class CadastroAdotanteEnderecoComponent implements OnInit {

  formCadastroAdotante: FormGroup;
  listSexo = ['Feminino', 'Masculino', 'Nao declarar'];
  listaPassos = ['Dados Pessoais', 'Endereço', 'Segurança', 'Upload de Imagem'];
  disabled: boolean = false;
  id: any;
  selectedMessagePessoa: any;
  estados: any[] = [];
  cidades: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private fb: FormBuilder,
    public pessoaDataService: PessoaDataService,
    private repository: EnderecoRepository
  ) {}

  ngOnInit(): void {
    this.listarEstados();
    this.criaFormulario();
    this.id = this.activatedRoute.snapshot.params['id'];
    this.pessoaDataService.currentMessagePessoa.subscribe((message) => {
      if(message!=''){
        this.selectedMessagePessoa = message;
          }else{
        this.route.navigate(['cadastro-adotante'])
      }
    });
  }

  criaFormulario = () => {
    this.formCadastroAdotante = this.fb.group({
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      complemento: ['',],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      numero: ['', Validators.required],
    });
  };

  validar = () => {
    this.formCadastroAdotante.markAllAsTouched(); // Faz parecer que todos os campos foram clicados
    if (this.formCadastroAdotante.invalid) {
      console.log('\n inválido form  ');
      return;
    }

    const adotante = this.formCadastroAdotante.getRawValue() as PessoaModel; // retorna os campos que existem dentro do formGroup cadastro
    if (this.id) {
      adotante.id = this.id;
      console.log('editar *** ' + adotante.nome);
      // this.editar(adotante);
    } else {
      console.log('salvar *** ' + adotante.nome);
      this.salvar(adotante);
    }
  };

  private salvar = (adotante: PessoaModel) => {

      console.log(adotante);
      if (this.selectedMessagePessoa != '') {
        Object.assign(adotante, JSON.parse(this.selectedMessagePessoa));
      }
  
      this.pessoaDataService.changeMessage(JSON.stringify(adotante));
      this.trocaRota();
    }
  

  resetForm(): void {
    this.formCadastroAdotante.reset();
  }

  trocaRota = (evento?) => {
    if (evento) {
      evento.target.innerText == 'Voltar'
        ? this.route.navigate(['cadastro-adotante'])
        : this.route.navigate(['cadastro-adotante-2']);
    } else {
      this.route.navigate(['cadastro-adotante-2']);
    }
  };

  listarEstados() {
    this.repository.getAllEstados().subscribe((resposta) => {
      this.estados.push({ label: resposta.nome, value: resposta.id });
    });
  }

  listarCidades() {
    this.cidades = [];
    let id: number = this.formCadastroAdotante.value.estado;
    this.repository.getAllCidadesByEstado(id).subscribe((resposta) => {
      this.cidades.push({ label: resposta.nome, value: resposta.id });
    });
  }

}
