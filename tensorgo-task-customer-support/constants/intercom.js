const CONVERSATION = {
  TYPE: {
    ALL: "all",
    OPEN: "open",
    CLOSE: "close",
  },
};

const INTERACTION = {
  GENERAL_QUERY: "general query",
  PRODUCT_FEATURE_QUERY: "product feature query",
  PRODUCT_PRICING_QUERY: "product pricing query",
  PRODUCT_FEATURE_IMPLEMENTATION_REQUEST:
    "product feature implementation request",
};

const intercomConstants = {
  conversation: CONVERSATION,
  interaction: INTERACTION,
};

export default intercomConstants;
