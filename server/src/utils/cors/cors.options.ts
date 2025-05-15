import { corsDomains } from './cors.domains';

export const corsOptions = {
  origin: corsDomains,
  credentials: true,
};
