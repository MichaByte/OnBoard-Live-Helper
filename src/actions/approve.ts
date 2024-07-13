import Slack from "@slack/bolt";

import { prisma } from "../util/prisma.js";
import markdown_message from "../blocks/markdown_message.js";

export function approve(app: Slack.App) {
  app.action("approve", async ({ ack, body, client }) => {
    ack();

    if (body.type !== "block_actions") {
      return;
    }

    const adminUserId = body.user.id;
    // @ts-expect-error
    const userSlackId = body.actions[0].value;

    const msgBlocks = body.message!.blocks;
    msgBlocks[2] = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Approved by <@${adminUserId}>`,
      },
    };

    await client.chat.update({
      channel: body.container.channel_id,
      ts: body.container.message_ts,
      text: `Approved by <@${adminUserId}>`,
      blocks: msgBlocks,
    });


    // Delay 5 minutes to allow time for caching
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 5));

    await client.chat.postMessage({
      channel: userSlackId,
      text: "Your request to join OnBoard Live has been approved!",
    });

    await client.chat.postMessage({
      channel: userSlackId,
      blocks: markdown_message(
        `Your stream key for OnBoard Live is \`if_you_see_this_something_has_gone_terribly_wrong\`. Please DO NOT share this with anyone, and treat it like a password!`
      ),
      text: `Your stream key for OnBoard Live is \`if_you_see_this_something_has_gone_terribly_wrong\`. Please DO NOT share this with anyone, and treat it like a password!`,
    });

    // Mark user as approved in database

    await prisma.users.update({
      where: {
        slack_user_id: userSlackId,
      },
      data: {
        is_approved: true,
      },
    });
  });
}
