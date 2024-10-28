"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const node_sdk_1 = require("@stream-io/node-sdk");
const apikey = "3nzxjr64zv64";
const apiSecret = "g6xss4bbuwxkp83awzhjpvx3bx96jtdzczu7u863z9nsm8m4hkjgax45nfquvhdu";
exports.client = new node_sdk_1.StreamClient(apikey, apiSecret);
