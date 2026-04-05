'use client';

import type { EmailOtpType } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { supabase } from "@/lib/supabaseClient";

const emailOtpTypes: EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

const expiredLinkMessage =
  "O link de acesso expirou ou já foi utilizado. Peça um novo e-mail.";
const invalidLinkMessage =
  "Não foi possível validar o link de acesso. Solicite um novo e-mail.";

function normalizeAuthMessage(message: string | null | undefined) {
  if (!message) {
    return invalidLinkMessage;
  }

  const normalized = message.trim();

  if (!normalized) {
    return invalidLinkMessage;
  }

  if (
    /expired|already been used|otp_expired|token has expired|invalid grant/i.test(
      normalized,
    )
  ) {
    return expiredLinkMessage;
  }

  if (/redirect|redirect_to|not allowed/i.test(normalized)) {
    return "A URL de retorno desse login não está liberada no Supabase Auth.";
  }

  return normalized;
}

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return Boolean(value && emailOtpTypes.includes(value as EmailOtpType));
}

function getParam(
  query: URLSearchParams,
  hash: URLSearchParams,
  key: string,
) {
  return query.get(key) ?? hash.get(key);
}

function buildLoginErrorPath(message: string) {
  return `/login?error=${encodeURIComponent(message)}`;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState(
    "Validando o link recebido...",
  );

  useEffect(() => {
    let active = true;

    const redirectTo = (path: string) => {
      if (active) {
        router.replace(path);
      }
    };

    const completeLogin = async () => {
      try {
        const query = new URLSearchParams(window.location.search);
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const errorDescription = getParam(query, hash, "error_description");

        if (errorDescription) {
          redirectTo(
            buildLoginErrorPath(normalizeAuthMessage(errorDescription)),
          );
          return;
        }

        const code = query.get("code");

        if (code) {
          setStatusMessage("Confirmando o código de acesso...");

          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error(error);
            redirectTo(buildLoginErrorPath(normalizeAuthMessage(error.message)));
            return;
          }

          redirectTo("/app");
          return;
        }

        const tokenHash = getParam(query, hash, "token_hash");
        const type = getParam(query, hash, "type");

        if (tokenHash && isEmailOtpType(type)) {
          setStatusMessage("Validando o token recebido...");

          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          });

          if (error) {
            console.error(error);
            redirectTo(buildLoginErrorPath(normalizeAuthMessage(error.message)));
            return;
          }

          redirectTo("/app");
          return;
        }

        const accessToken = getParam(query, hash, "access_token");
        const refreshToken = getParam(query, hash, "refresh_token");

        if (accessToken && refreshToken) {
          setStatusMessage("Criando sua sessão...");

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error(error);
            redirectTo(buildLoginErrorPath(normalizeAuthMessage(error.message)));
            return;
          }

          redirectTo("/app");
          return;
        }

        setStatusMessage("Recuperando sua sessão...");

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(error);
          redirectTo(buildLoginErrorPath(normalizeAuthMessage(error.message)));
          return;
        }

        redirectTo(session ? "/app" : buildLoginErrorPath(invalidLinkMessage));
      } catch (error) {
        console.error(error);
        const message =
          error instanceof Error ? error.message : invalidLinkMessage;
        redirectTo(buildLoginErrorPath(normalizeAuthMessage(message)));
      }
    };

    void completeLogin();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="mx-auto max-w-2xl">
      <section className="km-panel-strong rounded-[30px] p-8 text-center">
        <div className="mx-auto w-fit">
          <BrandMark compact />
        </div>
        <div className="mt-8 flex justify-center">
          <span className="relative inline-flex h-14 w-14">
            <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--km-green)]/20" />
            <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--km-green)] text-sm font-bold text-white">
              KM
            </span>
          </span>
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em] text-[color:var(--km-blue-strong)]">
          Confirmando seu acesso.
        </h1>
        <p className="mt-3 text-sm leading-7 text-[color:var(--foreground-muted)]">
          {statusMessage}
        </p>
      </section>
    </div>
  );
}
