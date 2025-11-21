import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
  path: '',
  redirectTo: 'auth/inicial',
  pathMatch: 'full'
},
{
  path: 'home',
  loadComponent: () => import('./features/home/components/home-component/home.component').then(m => m.HomeComponent),
  canActivate: [authGuard]
    },
{
  path: 'perfil',
  loadComponent: () => import('./features/perfil/components/perfil/perfil').then(m => m.Perfil),
  canActivate: [authGuard]
},

{
    path: 'solicitacoes',
    canActivate: [authGuard],
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
    path: 'chamado-personalizado',
    loadComponent: () => import('./features/solicitacao/components/chamado-personalizado/chamado-personalizado').then(m => m.ChamadoPersonalizado),
    canActivate: [authGuard]
  },
  {
    path: 'sugestao-melhoria',
    loadComponent: () => import('./features/solicitacao/components/sugestao-melhoria/sugestao-melhoria').then(m => m.SugestaoMelhoria),
    canActivate: [authGuard]
  },
  {
    path: 'solicitar-apoio',
    loadComponent: () => import('./features/solicitacao/components/solicitar-apoio/solicitar-apoio').then(m => m.SolicitarApoio),
    canActivate: [authGuard]
  },
  {
    path: 'reportar-problema',
    loadComponent: () => import('./features/solicitacao/components/reportar-problema/reportar-problema').then(m => m.ReportarProblema),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
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
      path: 'inicial',
      loadComponent: () => import('./features/auth/components/inicial/inicial').then(m => m.Inicial)
    },
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

