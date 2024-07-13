import Slack from "@slack/bolt";

import { prisma } from "../util/prisma.js";

import approved_home from "../blocks/approved_home.js";
import unapproved_home from "../blocks/unapproved_home.js";
import unregistered_home from "../blocks/unregistered_home.js";

export async function app_home_opened(app: Slack.App) {
  app.event("app_home_opened", async ({ event, client }) => {
    const user = event.user;
    const { name, is_approved, email } =
      (await prisma.users.findUnique({
        where: {
          slack_user_id: user,
        },
        select: {
          name: true,
          is_approved: true,
          ssh_public_key: true,
          email: true,
        },
      })) ?? {};

    if (name && is_approved) {
      await client.views.publish({
        user_id: user,
        view: approved_home(name, email!,),
      });
    } else if (name && !is_approved) {
      await client.views.publish({
        user_id: user,
        view: unapproved_home(name, email!),
      });
    } else {
      await client.views.publish({
        user_id: user,
        view: unregistered_home(),
      });
    }
  });
}
