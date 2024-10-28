import { StreamClient } from "@stream-io/node-sdk";

const apikey = "3nzxjr64zv64";
const apiSecret = "g6xss4bbuwxkp83awzhjpvx3bx96jtdzczu7u863z9nsm8m4hkjgax45nfquvhdu";

export const client = new StreamClient(apikey, apiSecret);
