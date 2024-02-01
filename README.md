# ommy

Unofficial provider for working with notion AI

## Installation

**Using npm:**
```bash
npm i ommy
```

**Using yarn:**
```bash
yarn add ommy
```

## Usage

First, you need to copy the cookie value with the key `token_v2`. This token needs to be passed in the function call.

### search

Searching for an answer in your Notion

```js
import { search } from 'ommy/notion';

const answer = await search({
    text: 'the process of caching a request from the service with DNA data',
    token,
});
```

### translate

```js
const answer = await translate({
    text: 'Denken Sie sich einen Namen für eine Variable aus, die für das Zwischenspeichern von Anfragen aus dem Dienst mit DNA-Daten verantwortlich ist',
    language: 'english',
    token,
});
```

### helpMeEdit

Free-form request to Notion AI

```js
import { helpMeEdit } from 'ommy/notion';

const answer = await helpMeEdit({
    prompt: 'Think up a name for a variable responsible for caching requests from the service with DNA data',
    token,
});
```

## License

[MIT](https://github.com/vordgi/ommy/blob/main/LICENSE)
