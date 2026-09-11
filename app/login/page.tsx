import { Auth } from "@/components/auth/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    invite?: string;
  }>;
}) {
  const params = await searchParams;
  const inviteToken = params.invite ?? null;

  return (
    <Auth
      initialMode="login"
      inviteToken={inviteToken}
    />
  );
}