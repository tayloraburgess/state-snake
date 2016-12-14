/* eslint-env node */

import url from 'url';

const Route = {
  process(req, res) {
    const parsed = url.parse(req.url, true);
    if (parsed.pathname.match(this.endpoint)) {
      this.callback(req, res);
    } else {
      this.next.process(req, res);
    }
  },
};

const factoryRoute = (endpoint, callback, next) => {
  return Object.assign(Object.create(Route), {
    endpoint,
    callback,
    next,
  });
};

export default factoryRoute;
