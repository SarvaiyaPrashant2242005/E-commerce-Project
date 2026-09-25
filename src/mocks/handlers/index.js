// Master list of MSW handlers
import { productHandlers } from "./products";
import { storeHandlers } from "./stores";
import { authHandlers } from "./auth";
import { orderHandlers } from "./orders";
import { vendorHandlers } from "./vendor";
import { adminHandlers } from "./admin";

export const handlers = [
  ...productHandlers,
  ...storeHandlers,
  ...authHandlers,
  ...orderHandlers,
  ...vendorHandlers,
  ...adminHandlers,
];
