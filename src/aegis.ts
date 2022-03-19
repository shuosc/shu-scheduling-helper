import Aegis from 'aegis-web-sdk';

const aegis = new Aegis({
  id: 'EPVVxcrqZkPv8bY0gK',
  reportApiSpeed: true,
  reportAssetSpeed: true,
  env: process.env.NODE_ENV === 'development' ? Aegis.environment.local : Aegis.environment.production,
});

export default aegis;
