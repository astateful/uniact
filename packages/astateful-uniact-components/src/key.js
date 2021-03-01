import isEmpty from 'lodash/isEmpty';

const generateClientKey = router => {
  return `${router.location.pathname}.client.${new Date().getTime()}`;
};

const generateServerKey = (router, session) => {
  const firstPart = (() => {
    if (typeof router.location === 'string') {
      return `${router.location}.server`;
    }
    return `${router.location.pathname}.server`;
  })();

  // TODO: Too much application logic here, provide
  // a way for the client to configure this somehow?
  if (session && 'tokens' in session) {
    const loggedOut = isEmpty(session['tokens']);
    return `${firstPart}.${loggedOut}`;
  }

  return firstPart;
};

export { generateClientKey, generateServerKey };
