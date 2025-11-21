import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro inesperado';

      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        // Erro do lado do servidor
        switch (error.status) {
          case 401:
            // Token inválido ou expirado - fazer logout
            errorMessage = 'Sessão expirada. Faça login novamente.';
            authService.logout();
            break;
          case 403:
            errorMessage = 'Você não tem permissão para acessar este recurso.';
            router.navigate(['/home']);
            break;
          case 404:
            errorMessage = 'Recurso não encontrado.';
            break;
          case 500:
            errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
            break;
          default:
            errorMessage = error.error?.message || errorMessage;
        }
      }

      console.error('Erro HTTP:', errorMessage, error);
      return throwError(() => ({ message: errorMessage, status: error.status }));
    })
  );
};
