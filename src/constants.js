const {env} = process;

require('dotenv').config();

module.exports = {
  'PARTNER_ID': env.PARTNER_ID,
  'PARTNER_KEY': env.PARTNER_KEY
};
