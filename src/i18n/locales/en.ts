import components from "../components/en";
import landing from "../landing/en";
import requests from "../requests/en";
import response from "../responses/en";

const en = {
  translation: {
    ...components.translation,
    ...landing.translation,
    ...requests.translation,
    ...response.translation,
  },
};

export default en;
