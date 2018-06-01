require('dotenv').config();

const {env} = process;
const ELK_HOST = env.ELK_HOST || 'localhost:9200';

module.exports = {
  'ELK_URI': `http://${ELK_HOST}`,
  'PARTNER_ID': env.PARTNER_ID,
  'PARTNER_KEY': env.PARTNER_KEY
};
