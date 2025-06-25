"use client";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, MapPin, X } from "lucide-react";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, register, isLoading } = useAuth();

  const loginForm = useForm<LoginForm>();
  const registerForm = useForm<RegisterForm>();

  const onLoginSubmit = async (data: LoginForm) => {
    const success = await login(data.email, data.password);
    if (success) {
      onClose();
    } else {
      loginForm.setError("email", { message: "invalid credential" });
    }
  };
  const onRegisterSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      registerForm.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      return;
    }

    const success = await register(data.name, data.email, data.password);
    if (success) {
      onClose();
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-300 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-gray-900">
              {isLogin ? "Welcome Back" : "Join MyJourney"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLogin ? (
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-body font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...loginForm.register("email", {
                    required: "Email is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  placeholder="alex@example.com"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...loginForm.register("password", {
                      required: "Password is required",
                    })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                    placeholder="password123"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-300 bg-blue-300 cursor-pointer hover:bg-primary-400 disabled:bg-primary-200 text-white py-2 rounded-lg font-body font-medium transition-colors duration-200"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-body font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...registerForm.register("name", {
                    required: "Name is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  placeholder="Alex Chen"
                />
                {registerForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...registerForm.register("email", {
                    required: "Email is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  placeholder="alex@example.com"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...registerForm.register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...registerForm.register("confirmPassword", {
                    required: "Please confirm your password",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-300 bg-blue-300 hover:bg-primary-400 disabled:bg-primary-200 text-white py-2 rounded-lg font-body font-medium transition-colors duration-200"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 font-body">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-primary-400 hover:text-primary-500 font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Demo Info */}
          {isLogin && (
            <div className="mt-4 p-3 bg-warning/20 rounded-lg">
              <p className="text-xs font-body text-gray-600">
                <strong>Demo:</strong> Use any email with password "password123"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
