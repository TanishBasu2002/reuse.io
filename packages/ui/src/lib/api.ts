import type {
  forgotPasswordType,
  LoginType,
  mfaLoginType,
  mfaType,
  registerType,
  resetPasswordType,
  SessionResponseType,
  verifyEmailType,
  verifyMFAType,
} from "@repo/ui/types/index";
import { API } from "./axios-client";

export const loginMutationFn = async (data: LoginType) =>
  await API.post("/auth/login", data);

export const registerMutationFn = async (data: registerType) =>
  await API.post("/auth/register", data);

export const verifyEmailMutationFn = async (data: verifyEmailType) =>
  await API.post("/auth/verify/email", data);

export const forgotPasswordMutationFn = async (data: forgotPasswordType) =>
  await API.post("/auth/password/forgot", data);

export const resetPasswordMutationFn = async (data: resetPasswordType) =>
  await API.post("/auth/password/reset", data);

export const verifyMFALoginMutationFn = async (data: mfaLoginType) =>
  await API.post("/mfa/verify-login", data);

export const logoutMutationFn = async () => await API.post("/auth/logout");

export const mfaSetupQueryFn = async () => {
  const response = await API.get<mfaType>("/mfa/setup");
  return response.data;
};

export const verifyMFAMutationFn = async (data: verifyMFAType) =>
  await API.post("/mfa/verify", data);

export const revokeMFAMutationFn = async () => await API.put("/mfa/revoke", {});

export const getUserSessionQueryFn = async () => await API.get("/session/");

export const sessionsQueryFn = async () => {
  const response = await API.get<SessionResponseType>("/session/all");
  return response.data;
};

export const sessionDelMutationFn = async (id: string) =>
  await API.delete(`/session/${id}`);
