# glasstic

> index glassdoor into Elasticsearch

## Installation

```sh
❯ yarn add glasstic
```

## Usage

### api browse

```js
const glasstic = require('glasstic');

const configuration = {
  'params': 'action=employers&userip=0.0.0.0&useragent=Mozilla/%2F4.0&country=france',
  'proxy': 'localhost:8118'
};

async function save () {
  try {
    const employers = await glasstic.browse(configuration);

    await glasstic.bulk(employers, 'employers');
  } catch (e) {
    console.error(e);
  }
}

save();
```

## API

The `params` of `configuration` is based on https://www.glassdoor.com/developer/companiesApiActions.htm
