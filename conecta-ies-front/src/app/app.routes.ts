import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'solicitacoes',
    pathMatch: 'full'
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
  }
];

