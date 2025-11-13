import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  cadastroForm!: FormGroup;

  perfis = ['Aluno', 'Professor']; 

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      matricula: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      perfil: ['', [Validators.required]], 
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    const { senha, confirmarSenha } = this.cadastroForm.value;
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    console.log('Usuário cadastrado:', this.cadastroForm.value);
    alert('Cadastro realizado com sucesso!');
  }
}
