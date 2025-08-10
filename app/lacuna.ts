import { Lacuna } from '@tlecommunity/client';
import environment from './environment';

const lacuna = new Lacuna({ serverUrl: environment.getServerUrl() });
lacuna.log.setLogLevel('info');

export default lacuna;
