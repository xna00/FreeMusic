import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http";

export const state = {
  id: 0,
};

export type Info = {
  requestHeaders: IncomingHttpHeaders;
  responseHeaders?: OutgoingHttpHeaders;
  statusCode?: number;
};
export const idMap: {
  [K in number]: Info;
} = {};

export const getInfo = () => idMap[state.id];

export const normalizeHeaders = (
  headers: OutgoingHttpHeaders
): OutgoingHttpHeaders => {
  return Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
  );
};
