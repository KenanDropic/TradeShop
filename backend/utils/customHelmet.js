import helmet from "helmet";

export const customHelmet = (app) => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", "http://localhost:3000/"],
          scriptSrc: [
            "'self'",
            "'unsafe-eval'",
            "'unsafe-inline'",
            "https://www.paypal.com",
            "https://*.paypal.com",
            "https://*.paypal.cn",
            "https://*.paypalobjects.com",
            "https://tradeshop-mern.herokuapp.com",
            "https://www.recaptcha.net",
            "https://www.gstatic.com",
          ],
          connectSrc: [
            "'self'",
            "https://www.sandbox.paypal.com/xoplatform/logger/api/logger",
          ],
          frameSrc: [
            "'self'",
            "https://www.sandbox.paypal.com/",
            "https://bid.g.doubleclick.net/",
          ],
          imgSrc: [
            "'self'",
            "https://www.paypalobjects.com/images/checkout/hermes/icon_ot_spin_lock_skinny.png",
          ],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );
};
