import { Router } from "express";
import { intercom } from "../controllers/intercom.js";
import intercomConstants from "../constants/intercom.js";
import string from "../utils/string.js";
import axios from "axios";


const router = Router();

const CONVOTYPES = intercomConstants.conversation.TYPE;

router.get("/", async (req, res) => {
  const { type = CONVOTYPES.OPEN } = req.query;

  const response = await intercom.getConversations(req.user.intercomContactId);

  // filter according to requested conversation type
  const conversations =
    type === CONVOTYPES.ALL
      ? response.conversations
      : response.conversations.filter(
          (convo) => convo.open === (type === CONVOTYPES.OPEN ? true : false)
        );

  res.status(200).json({ count: conversations.length, conversations });
});

router.post("/", async (req, res) => {
  const { body: bodyRaw, interaction: interactionRaw } = req.body;

  if (!intercom.isValidInteraction(interactionRaw)) {
    res
      .status(400)
      .json({ message: "Please select an appropriate interaction type" });
    return;
  }

  const interaction = string.toTitleCase(interactionRaw);
  const body = bodyRaw ?? interaction;

  try {
    const convo = await intercom.startConversation(
      req.user?.intercomContactId,
      body,
      interaction
    );
    await axios.post("https://hooks.zapier.com/hooks/catch/22550620/2xurezu/", {
  userId: req.user?.id,
  intercomContactId: req.user?.intercomContactId,
  interaction: interaction,
  timestamp: new Date().toISOString()
});

    res
      .status(200)
      .json({ message: "Message Send", conversationId: convo.conversation_id });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Some error happened, try again" });
  }
});

router.get("/read", async (req, res) => {
  const { conversationId } = req.query;

  const messages = await intercom.readConversation(conversationId);

  // assigned person
  const assignedPersonId = messages.admin_assignee_id;
  let assignedPersonInfo = {};

  // get the messages in order, and filter by only the assigne id
  let y = 0;
  const convo = [
    messages.source,
    ...messages.conversation_parts.conversation_parts.filter((x) => {
      if (y === 0 && x.author.id == assignedPersonId) {
        y = 1;
        assignedPersonInfo = { ...x.author };
      }
      return x.author.id == assignedPersonId; // it may be string or a number
    }),
  ];

  res.status(200).json({
    assignedTo: assignedPersonInfo,
    messages: convo,
    interactionType: messages.custom_attributes.interaction,
    createdAt: messages.created_at,
    title: messages.title,
  });
});

export const QueryRouter = router;
