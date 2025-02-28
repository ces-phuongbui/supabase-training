import components from "../components/vi";
import landing from "../landing/vi";
import requests from "../requests/vi";
import response from "../responses/vi";

const en = {
  translation: {
    ...components.translation,
    ...landing.translation,
    ...requests.translation,
    ...response.translation,
  },
};

export default en;
