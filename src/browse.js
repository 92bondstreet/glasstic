const agent = require('xcii-agent');
const delay = require('delay');
const pLimit = require('p-limit');
const pSettle = require('p-settle');
const {PARTNER_ID, PARTNER_KEY} = require('./constants');

const limit = pLimit(10);

/**
 * Fetch data from stock api
 * @param  {String} params
 * @param  {String} page
 * @return {Promise}
 */
const fetch = async configuration => {
  const {totalNumberOfPages, params, page} = configuration;
  const url = `http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=${PARTNER_ID}&t.k=${PARTNER_KEY}&useragent=${agent.ua}&pn=${page}&${params}`;

  console.log(`fetching from page ${page}/${totalNumberOfPages}...`);

  try {
    const response = await agent.get({url});

    await delay(2500);

    return JSON.parse(response.text);
  } catch (e) {
    console.error(agent.format.error(e));
    return Promise.reject(agent.format.error(e));
  }
};

 /**
 * Browse data according params from glassdoor api
 * @param  {Object} configuration
 * @return {Array}
 */
module.exports = async function browse (configuration) {
  const {params, proxy} = configuration;
  let page = 1;
  let totalNumberOfPages = 1;

  // the first request allows us to get the lastPage (and first products)
  console.log('fetching the first page to get the pagination...');

  const {response = {}} = await fetch({totalNumberOfPages, params, page, proxy});

  totalNumberOfPages = response.totalNumberOfPages;

  const promises = Array.from(new Array(totalNumberOfPages), (val, index) => index + 1)
    .map(index => {
      return limit(async () => await fetch({totalNumberOfPages, params, 'page': index, proxy}));
    });

  const results = await pSettle(promises);
  const isFulfilled = results.filter(result => result.isFulfilled).map(result => result.value.response.employers);
  const employers = [].concat.apply([], isFulfilled);

  return employers;
};
