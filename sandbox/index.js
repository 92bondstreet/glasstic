const glasstic = require('../index');

const configuration = {
  'params': 'action=employers&country=france',
  'proxy': '178.206.230.65:8080'
};

async function save () {
  try {
    const employers = await glasstic.browse(configuration);

    console.log(employers);
  } catch (e) {
    console.error(e);
  }
}

save();
