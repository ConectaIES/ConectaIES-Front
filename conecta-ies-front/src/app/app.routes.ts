import { Routes } from '@angular/router';

export const routes: Routes = [
  {
  path: '',
  redirectTo: 'auth/inicial',
  pathMatch: 'full'
},
{
  path: 'home',
  loadComponent: () => import('./features/home/components/home-component/home.component').then(m => m.HomeComponent)
    },
{
  path: 'perfil',
  loadComponent: () => import('./features/perfil/components/perfil/perfil').then(m => m.Perfil)
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
    path: 'chamado-personalizado',
    loadComponent: () => import('./features/solicitacao/components/chamado-personalizado/chamado-personalizado').then(m => m.ChamadoPersonalizado)
  },
  {
    path: 'sugestao-melhoria',
    loadComponent: () => import('./features/solicitacao/components/sugestao-melhoria/sugestao-melhoria').then(m => m.SugestaoMelhoria)
  },
  {
    path: 'solicitar-apoio',
    loadComponent: () => import('./features/solicitacao/components/solicitar-apoio/solicitar-apoio').then(m => m.SolicitarApoio)
  },
  {
    path: 'reportar-problema',
    loadComponent: () => import('./features/solicitacao/components/reportar-problema/reportar-problema').then(m => m.ReportarProblema)
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

