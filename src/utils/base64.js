// const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
// const BASE = CHARS.length;

// export function generateShortId() {
//   let id = "";
//   // Generate 7 characters (allows for ~3.5T combinations)
//   for (let i = 0; i < 7; i++) {
//     id += CHARS.charAt(Math.floor(Math.random() * BASE));
//   }
//   return id;
// }

//? Better way to generate unique IDs avoid collisions using Twitter Snowflake ID

import { Snowflake } from "@theinternetfolks/snowflake";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const TARGET_LENGTH = 7;

export function generateShortId() {
  const snowflake = Snowflake.generate();
  console.log(snowflake);
  return toBase62(snowflake);
}

function toBase62(decimal) {
  // Convert the snowflake to a BigInt and ensure it's positive
  let num = BigInt(decimal);
  if (num < 0n) num = -num;

  let result = "";
  const base = BigInt(BASE62.length);

  // Keep dividing by 62 and using the remainder to map to our BASE62 characters
  do {
    const remainder = Number(num % base);
    result = BASE62[remainder] + result;
    num = num / base;
  } while (num > 0n);

  // If the result is shorter than TARGET_LENGTH, pad with random BASE62 chars
  // This maintains uniqueness while ensuring consistent length
  while (result.length < TARGET_LENGTH) {
    const randomIndex = Math.floor(Math.random() * BASE62.length);
    result = BASE62[randomIndex] + result;
  }

  // If longer than TARGET_LENGTH, take the last TARGET_LENGTH characters
  if (result.length > TARGET_LENGTH) {
    result = result.slice(-TARGET_LENGTH);
  }

  return result;
}
