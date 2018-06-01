const elasticsearch = require('elasticsearch');
const {ELK_URI} = require('./constants');

const esClient = new elasticsearch.Client({
  'host': ELK_URI,
  'log': 'error'
});

/**
 * Index results from glassdoor api params
 * @param  {Object} configuration
 */
module.exports = async (values, type) => {
  const bulks = values.map(value => {
    return [{
      'index': {
        '_index': 'glassdoor',
        '_type': type,
        '_id': value.id
      }
    }, value];
  });
  const indexes = [].concat(...bulks);

  try {
    const response = await esClient.bulk({'body': indexes});
    const errors = response.items.filter(item => item.index && item.index.error)
      .map(value => JSON.stringify(value, null, 2));

    console.error(errors.join('\n'));
    console.log(`Successfully indexed ${response.items.length - errors.length} out of ${values.length} items`);
  } catch (e) {
    console.error(e);
  }
};
