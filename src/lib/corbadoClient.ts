import Corbado from '@corbado/web-js';

const corbado = Corbado.load({
  project_id: import.meta.env.VITE_CORBADO_PROJECT_ID,
  frontend_api: import.meta.env.VITE_CORBADO_FRONTEND_API,
});

export default corbado;