export default function unapproved_home(
  name: string,
  email: string,
) {
  return {
    type: "home" as const,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "OnBoard Live Helper",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Your OnBoard Live account is pending approval! Here's your profile:",
        },
      },
      {
        type: "divider",
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Full Name:* ${name}`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Email:* ${email}`,
        },
      },
    ],
  };
}
