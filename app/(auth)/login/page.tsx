import type { Metadata } from "next";

import { LoginForm } from "./login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in | CopeCares",
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to manage appointments, pets, and clinic operations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-6 rounded-lg bg-zinc-50 p-4 text-xs text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
          <p className="mb-1 font-medium text-zinc-700 dark:text-zinc-300">
            Demo accounts
          </p>
          <p>admin@copecares.com / admin123</p>
          <p>vet@copecares.com / vet123</p>
          <p>staff@copecares.com / staff123</p>
          <p>owner@test.com / owner123</p>
        </div>
      </CardContent>
    </Card>
  );
}
