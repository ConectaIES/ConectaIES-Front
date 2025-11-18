import { Routes } from '@angular/router';

export const routes: Routes = [
  {
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
},
{
  path: 'home',
  loadComponent: () => import('./features/home/components/home-component/home.component').then(m => m.HomeComponent)
    },

{
    path: 'solicitacoes',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/solicitacao/components/listar-solicitacoes/listar-solicitacoes.component').then(m => m.ListarSolicitacoesComponent)
      },
      {
        path: 'nova',
        loadComponent: () => import('./features/solicitacao/components/criar-solicitacao/criar-solicitacao.component').then(m => m.CriarSolicitacaoComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/solicitacao/components/detalhe-solicitacao/detalhe-solicitacao.component').then(m => m.DetalheSolicitacaoComponent)
      }
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/solicitacao/components/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent)
      },
      {
        path: 'solicitacoes/:id',
        loadComponent: () => import('./features/solicitacao/components/detalhe-solicitacao/detalhe-solicitacao.component').then(m => m.DetalheSolicitacaoComponent)
      }
    ]
  },
  {
  path: 'auth',
  children: [
    {
      path: 'login',
      loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
    },
    {
      path: 'cadastro',
      loadComponent: () => import('./features/auth/components/cadastro/cadastro.component').then(m => m.CadastroComponent)
    }
  ]
}

];

