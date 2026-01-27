/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auctions from "../auctions.js";
import type * as auth from "../auth.js";
import type * as contact from "../contact.js";
import type * as equipment from "../equipment.js";
import type * as http from "../http.js";
import type * as router from "../router.js";
import type * as scrap from "../scrap.js";
import type * as seedData from "../seedData.js";
import type * as settings from "../settings.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auctions: typeof auctions;
  auth: typeof auth;
  contact: typeof contact;
  equipment: typeof equipment;
  http: typeof http;
  router: typeof router;
  scrap: typeof scrap;
  seedData: typeof seedData;
  settings: typeof settings;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
