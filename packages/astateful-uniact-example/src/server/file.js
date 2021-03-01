import path from 'path';

export default (appPath, render, send) => {
  if (process.env.NODE_ENV === 'production') {
    return async (ctx, next) => {
      if (ctx.request.originalUrl.indexOf('/assets') > -1) {
        const entirePath = path.resolve(
          path.join(appPath, '/build/', ctx.path)
        );

        const rel = path.relative(appPath, entirePath);

        await send(ctx, rel, { root: appPath });
      } else {
        const { status, content, redirect } = await render(ctx);

        if (redirect) {
          return ctx.redirect(redirect);
        } else {
          if (status) {
            ctx.status = status;
          }

          ctx.body = content;
        }
      }
    };
  }

  return async (ctx, next) => {
    const url = ctx.request.originalUrl;
    if (url.indexOf('/assets') > -1 || url.indexOf('/__webpack_hmr') > -1) {
      await next(); // forward to webpack
    } else {
      const { status, content, redirect } = await render(ctx);

      if (redirect) {
        return ctx.redirect(redirect);
      } else {
        if (status) {
          ctx.status = status;
        }

        ctx.body = content;
      }
    }
  };
};
