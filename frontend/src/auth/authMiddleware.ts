export const authMiddleware = (store:any) => (next:any) => (action:any) => {
  const state = store.getState();
  const authState = state.auth;

  if (action.meta?.requiresAuth) {
    if (!authState.isLoggedIn) {
      console.warn('Acceso denegado: El usuario no está autenticado.');
      return;
    }

    if (action.meta.requiresRole && !authState.user.roles.includes(action.meta.requiresRole)) {
      console.warn('Acceso denegado: Rol insuficiente.');
      return;
    }
  }

  return next(action);
};