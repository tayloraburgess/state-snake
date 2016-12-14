/* eslint-env node */

import url from 'url';

const Route = {
  // Simple class to route HTTP requests based on matching regex
  process(req, res) {
    // If the request URL matches the endpoint,
    // run the success callback--otherwise,
    // pass the request to the next Route object
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
    endpoint, // regex for URL end
    callback, // function to run if request URL matches endpoint
    next, // function to run if request URL and endpoint do not match
  });
};

export default factoryRoute;
