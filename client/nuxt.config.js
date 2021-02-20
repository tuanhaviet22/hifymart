module.exports = {
  srcDir: __dirname,
  buildDir: ".nuxt",
  devtools: true,
  server: {
    port: process.env.CLIENT_PORT || 3000 // default: 3000
  },
  components: true,
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: titleChunk =>
      titleChunk
        ? titleChunk + " - " + process.env.APP_NAME
        : process.env.APP_NAME,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "Mua điện thoại thông minh mới nhất 2020. Giảm giá hấp dẫn. Trả góp 0%. Bảo hành chính hãng."
      },
      {
        property: "og:type",
        content: "website"
      },
      {
        property: "og:locale",
        content: "vi_vn"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Global CSS
   */
  css: ["~assets/css/main.css", "normalize.css/normalize.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/axios",
    "~/plugins/notifier.js",
    "~/plugins/global-method.js",
    { src: "~/plugins/vuex-persistedstate" },
    { src: "~/plugins/vue-apexcharts", ssr: false },
    { src: "~/plugins/vuex-shared-mutations", ssr: false }
  ],

  env: {
    baseUrl: process.env.CLIENT_BASE_URL || "http://localhost:3000",
    apiUrl: process.env.APP_URL || "http://localhost:8000",
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    appName: process.env.APP_NAME || "VietMart"
  },
  vue: {
    config: {
      productionTip: false,
      devtools: process.env.APP_DEBUG || true
    }
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/auth/login",
            method: "post",
            propertyName: "token"
          },
          user: {
            url: "/auth/user",
            method: "get",
            propertyName: "data"
          },
          logout: { url: "/auth/logout", method: "post" }
        }
      }
    },
    redirect: {
      login: "/auth/login",
      home: "/"
    },
    plugins: ["~/plugins/auth"],
    debug: process.env.APP_DEBUG || true
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // Doc: https://auth.nuxtjs.org/
    "@nuxtjs/auth",
    // Doc: https://github.com/nuxt-community/robots-module
    "@nuxtjs/robots",
    "cookie-universal-nuxt"
    // [
    //   "@nuxtjs/recaptcha",
    //   {
    //     hideBadge: true,
    //     language: "vi",
    //     siteKey: "6LcGFbwUAAAAAKKx9MgGbOP8n--vLLPXqyl6vQ5D",
    //     version: 3
    //   }
    // ],
  ],
  buildModules: ["@nuxtjs/vuetify"],
  vuetify: {
    optionsPath: "./vuetify.options.js"
  },
  robots: {
    UserAgent: "*",
    Disallow: "/admin"
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: (process.env.APP_URL || "http://localhost:8000") + "/api/",
    https: process.env.CLIENT_HTTPS || true
  },

  render: {
    bundleRenderer: {
      shouldPrefetch: (file, type) => {
        if (type === "script") {
          const ignoredRoutes = ["admin"];
          if (ignoredRoutes.some(r => file.includes(r))) {
            return false;
          }
        }
        return ["script", "style", "font"].includes(type);
      }
    }
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    publicPath: "/dist/",
    extractCSS: true,
    optimization: {
      splitChunks: {
        name: true
      }
    }
  }
};
