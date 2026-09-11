import { Auth } from "@/components/auth/auth";

export default async function RegisterPage({
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
      initialMode="register"
      inviteToken={inviteToken}
    />
  );
}