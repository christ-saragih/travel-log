import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { loginSchema, type LoginSchema } from "@/schemas/auth.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data);
      navigate("/");
    } catch (e) {
      console.error("Login failed via UI: ", e);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue exploring TravelLog.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="identifier">Email</Label>
            <Input
              {...register("identifier")}
              id="identifier"
              type="email"
              placeholder="name@example.com"
              aria-invalid={!!errors.identifier}
            />
            {errors.identifier && (
              <p className="text-destructive text-xs">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-destructive text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <LogIn className="h-4 w-4" />
            {isLoading ? "Memproses..." : "Sign in"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-muted-foreground justify-center text-sm">
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          className="text-foreground ml-1 font-medium underline underline-offset-4"
        >
          Register now
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
