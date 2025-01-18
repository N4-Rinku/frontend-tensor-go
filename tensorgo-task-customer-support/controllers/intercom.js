import { IntercomClient } from "intercom-client";
import env from "../constants/env.js";
import intercomConstants from "../constants/intercom.js";

const intercomClient = new IntercomClient({ token: env.intercom.ACCESS_TOKEN });

const getConversations = async (userContactId, offset = 0) => {
  const convos = await intercomClient.conversations.search({
    query: {
      field: "source.author.id",
      value: userContactId,
      operator: "=",
    },
    starting_after: offset,
  });

  return convos?.response;
};

const readConversation = async (conversationId, offset = 0) => {
  const messages = await intercomClient.conversations.find({
    conversation_id: conversationId,
    display_as: "string",
    starting_after: offset,
  });

  return messages;
};

const startConversation = async (userId, body, interaction) => {
  const conversation = await intercomClient.conversations.create({
    from: {
      type: "user",
      id: userId,
    },
    body,
  });

  // set the interaction
  await intercomClient.conversations.update({
    conversation_id: conversation.conversation_id,
    custom_attributes: { interaction },
  });

  return conversation;
};

const isValidInteraction = (interaction) => {
  const i = intercomConstants.interaction;
  return [
    i.GENERAL_QUERY,
    i.PRODUCT_FEATURE_IMPLEMENTATION_REQUEST,
    i.PRODUCT_FEATURE_QUERY,
    i.PRODUCT_PRICING_QUERY,
  ].includes(interaction);
};

export const intercom = {
  getConversations,
  readConversation,
  startConversation,
  isValidInteraction,
};

export default intercomClient;
