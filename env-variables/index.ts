const {
  URL_PAGE: urlPage = "http://localhost:8080",
  URL_API: urlApiS3 = "http://localhost:9000",
  LOCALE: locale = "es-ES",
} = process.env;

export const env = {
  urlPage,
  urlApiS3,
  locale,
};
