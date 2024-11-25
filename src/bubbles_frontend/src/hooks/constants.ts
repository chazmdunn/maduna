export const network = process.env.DFX_NETWORK || "local";

export const host = network === "local" ? "http://localhost:4943" : "https://icp0.io";

export const SNS_AGGREGATOR_CANISTER_URL = 'https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io';