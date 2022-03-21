import {
  sleep,
  fetchDomNode,
  getInnerText,
  setInnerText,
  getCountryAndState,
} from "./utils/util";
import { elementMapping } from "./element_mapping";
import { LOADING_TEXT } from "./utils/i18n";

const COUNTRY_API_FAILED = "COUNTRY_API_FAILED";
const REQUEST_BLOCKED = "REQUEST_BLOCKED";

async function skipNetflixAndPrime() {
  try {
    let skipButton;
    try {
      skipButton = fetchDomNode(elementMapping);
    } catch (err) {
      errorTrack(err, "FETCH_DOM_NODE");
    }

    if (!skipButton) {
      return;
    }

    const { domNode, type, extraWait, ...rest } = skipButton;

    if (domNode) {
      const innerText = getInnerText(domNode, type);

      if (innerText.toLowerCase() === LOADING_TEXT.toLowerCase()) {
        return;
      }

      if (extraWait) {
        await sleep(1200);
      }

      await setInnerText(domNode, type, LOADING_TEXT);
      domNode.click();

      let response;
      try {
        response = await getCountryAndState();
        response = await response.json();
      } catch (err) {
        const errObj = {
          message: err.message,
          errCode: response ? response.status : REQUEST_BLOCKED,
        };
        console.log(errObj);
      }

    }
  } catch (err) {
    console.log(err);
  }
}

setInterval(() => skipNetflixAndPrime(), 850);
