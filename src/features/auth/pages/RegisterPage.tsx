import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { registerSchema, type RegisterSchema } from "@/schemas/auth.schema";
import { toast } from "sonner";
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
import { UserPlus } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerAction, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerAction(data);
      toast.success("Successfully registered");
      navigate("/");
    } catch (e: unknown) {
      let errorMessage = "Failed to register, please try again.";
      if (typeof e === "object" && e !== null) {
        const apiMessage = (
          e as {
            response?: { data?: { error?: { message?: string } } };
          }
        ).response?.data?.error?.message;
        if (typeof apiMessage === "string" && apiMessage.trim()) {
          errorMessage = apiMessage;
        }
      }

      toast.error("Registration failed", {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>
          Sign up to start sharing your travel stories with the world.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              {...register("username")}
              id="username"
              type="text"
              placeholder="johndoe"
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <p className="text-destructive text-xs">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="name@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
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

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              {...register("confirmPassword")}
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <UserPlus className="h-4 w-4" />
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-muted-foreground justify-center text-sm">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-foreground ml-1 font-medium underline underline-offset-4"
        >
          Sign in here
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RegisterPage;
