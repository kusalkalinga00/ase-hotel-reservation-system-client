"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, User, Settings, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const CommonHeader = () => {
  const router = useRouter();
  const session = useSession();

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col items-center px-4 sm:px-0">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={"/assets/logo/logo.png"}
              alt="website logo"
              height={50}
              width={50}
              className="rounded-md object-cover"
            />
            <span className="font-bold text-xl">Saltbay Lounge</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {!session.data ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/register")}
              >
                Sign Up
              </Button>
              <Button size="sm" onClick={() => router.push("/login")}>
                <LogIn className="h-4 w-4 mr-2" />
                Log In
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    {session.data && (
                      <AvatarFallback>
                        {session.data.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.data.user.name || "Guest User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.data.user.email || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default CommonHeader;
