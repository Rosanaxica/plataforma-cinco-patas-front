import { PessoaRepository } from './../../../../_core/repository/pessoa-repository';
import { PessoaModel } from './../../../../_core/model/pessoa-model';
import { PessoaDataService } from './../../../../_services/pessoa-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro-adotante-match',
  templateUrl: './cadastro-adotante-match.component.html',
  styleUrls: ['./cadastro-adotante-match.component.css'],
})
export class CadastroAdotanteMatchComponent implements OnInit {
  formCadastroAdotante: FormGroup;
  listaPassos = ['Dados Pessoais', 'Endereço', 'Segurança', 'Upload de Imagem'];
  disabled = false;
  id: any;
  selectedMessagePessoa: any;
  mensagem: any;
  image: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public pessoaDataService: PessoaDataService,
    public repository: PessoaRepository,
  ) { }

  ngOnInit(): void {
    this.criaFormulario();
    this.id = this.activatedRoute.snapshot.params['id'];
    this.pessoaDataService.currentMessagePessoa.subscribe((message) => {
      if (message != '') {
        this.selectedMessagePessoa = message;
        console.log(this.selectedMessagePessoa);
      } else {
        this.router.navigate(['cadastro-adotante-2'])
      }
    });
  }

  criaFormulario = () => {
    this.formCadastroAdotante = this.fb.group({
      name: ['', Validators.required],
    });
  };

  trocaRota = (evento) => {
    evento.target.innerText == 'Voltar'
      ? this.router.navigate(['cadastro-adotante-2'])
      : this.router.navigate(['cadastro-adotante-3']);
  };

  submit(): void {
    this.formCadastroAdotante.markAllAsTouched(); // Faz parecer que todos os campos foram clicados
    // if (this.formCadastro.invalid) {
    //   console.log("\n inválido form  ")
    //   return;
    // }

    const pessoa = <PessoaModel>this.formCadastroAdotante.getRawValue(); // retorna os campos que existem dentro do formGroup cadastro
    if (this.id) {
      pessoa.id = this.id;
      console.log('editar *** ' + pessoa.nome);
      this.editar(JSON.parse(this.selectedMessagePessoa));
    } else {
      console.log('salvar *** ' + pessoa.nome);
      this.salvar(JSON.parse(this.selectedMessagePessoa));
    }
  }

  editar(pessoa) { }

  receiveImage(image) {
    this.image = image;
  }

  salvar(pessoa) {
    this.repository.postImagem(this.image).subscribe((resposta) => {
      //@ts-ignore
      let imageId = resposta.data.id;
      console.log(resposta);

      const dados: PessoaModel = {
        nome: pessoa.name,
        sexo: pessoa.sexo,
        rg: pessoa.rg,
        cpf: pessoa.cpf,
        dataNasc: pessoa.dataNasc,
        contato: pessoa.contato,
        tipo: "Comum",
        email: pessoa.email,
        senha: pessoa.senha,
        endereco: {
          cep: pessoa.cep,
          logradouro: pessoa.logradouro,
          numero: pessoa.numero,
          complemento: pessoa.complemento,
          bairro: pessoa.bairro,
          cidade: {
            id: pessoa.cidade,
            estado: {
              id: pessoa.estado,
            },
          },
        },
        imagem: {
          id: imageId,
        },
      } as PessoaModel;

      if (dados.id) {
        this.repository.putPessoa(dados).subscribe(resposta => {
          this.resetForm();
        });
      } else {
        this.repository.postPessoa(dados).subscribe(resposta => {
          this.mensagem = [
            {
              severity: 'success',
              summary: 'Instituicao',
              detail: 'cadastrado com sucesso!'
            }];
          // this.reiniciarForm();
          this.successToastr();
          this.router.navigate(["/login"])
        },
          (e) => {
            this.errorToastr();
            var msg: any[] = [];
            //Erro Principal
            msg.push({
              severity: 'error',
              summary: 'ERRO',
              detail: e.error.userMessage
            });
            //Erro de cada atributo
            var erros = e.error.objects;
            erros.forEach(function (elemento) {
              msg.push(
                {
                  severity: 'error',
                  summary: 'ERRO',
                  detail: elemento.userMessage
                });
            });
            this.mensagem = msg;
          }
        );
      }
      console.log(dados);
      // this.repository
      //   .postInstituicao(dados)
      //   .subscribe((resposta) => console.log(resposta));
    },
    (e) => {
      console.log(e);
      this.errorToastr();
    }
    
    );

  }

  resetForm() { }

  public successToastr() {
    this.toastr.success("Cadastro efetuado com sucesso!", "Foi enviado um e-mail com a confirmação!");
  }

  public errorToastr() {
    this.toastr.error("Não foi possível completar o cadastro", "Verifique os campos e tente novamente");
  }
}

