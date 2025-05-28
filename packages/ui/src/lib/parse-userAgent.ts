import * as UAParser from "ua-parser-js";
import { format, formatDistanceToNowStrict, isPast } from "date-fns";
import { Laptop, Smartphone } from "lucide-react";
import type { AgentType } from "~/types/interfaces";


export const parseUserAgent = (
  userAgent: string,
  createdAt: string
): AgentType => {
  const parser = new new UAParser(userAgent);
  const result = parser.getResult();

  const deviceType = result.device.type || "Desktop";
  const browser = result.browser.name || "Web";
  const os = `${result.os.name} ${result.os.version}`;

  const icon = deviceType === "mobile" ? Smartphone : Laptop;

  const formattedAt = isPast(new Date(createdAt))
    ? `${formatDistanceToNowStrict(new Date(createdAt))} ago`
    : format(new Date(createdAt), "d MMM, yyyy");

  return {
    deviceType,
    browser,
    os,
    timeAgo: formattedAt,
    icon,
  };
};
