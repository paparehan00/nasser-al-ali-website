import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

export function hashPassword(plain) {
  return bcrypt.hashSync(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

const STRONG_PW_RE = /^(?=.*[A-Za-z])(?=.*\d).{10,128}$/;

export function isPasswordStrongEnough(pw) {
  return typeof pw === "string" && STRONG_PW_RE.test(pw);
}
