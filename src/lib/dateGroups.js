import { isToday, isYesterday, isThisWeek, isThisMonth, differenceInDays } from "date-fns";

/**
 * Group conversations by date in NL labels. LibreChat-style.
 * Returns an array of [groupName, items[]] preserving the original order within each group.
 */
export function groupConversationsByDate(conversations) {
  const groups = new Map();
  const order = ["Vandaag", "Gisteren", "Deze week", "Vorige week", "Deze maand", "Ouder"];
  order.forEach((g) => groups.set(g, []));

  for (const c of conversations) {
    const ts = c.last_message_at || c.created_date || c.updated_date;
    const date = ts ? new Date(ts) : new Date(0);
    let label = "Ouder";

    if (isToday(date)) label = "Vandaag";
    else if (isYesterday(date)) label = "Gisteren";
    else if (isThisWeek(date, { weekStartsOn: 1 })) label = "Deze week";
    else if (differenceInDays(new Date(), date) < 14) label = "Vorige week";
    else if (isThisMonth(date)) label = "Deze maand";

    groups.get(label).push(c);
  }

  return order.map((g) => [g, groups.get(g)]).filter(([, items]) => items.length > 0);
}