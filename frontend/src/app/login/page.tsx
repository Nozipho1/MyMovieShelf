/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, type FormEvent, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login(): JSX.Element {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

     
      const text = await res.text();
      console.log(" raw signin response:", text);

     
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        console.warn("⚠️ signin response was not valid JSON");
      }

      if (!res.ok) {
        throw new Error(data.error || res.statusText || "Login failed");
      }

      
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_email", data.user.email);
        localStorage.setItem("user_id", data.user.id);
      }
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }

     
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-white text-center">Login</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-400">{error}</p>}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 text-white"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 text-white"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            onClick={(e) => handleSubmit(e as any)}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
