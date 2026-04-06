"use client"

import Navbar from "@/app/components/Navbar"
import AuthForm from "../components/AuthForm"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-20">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/tools/cyber-audit" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold tracking-wide uppercase">Cyber Audit</span>
            </Link>
          </div>
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  )
}
