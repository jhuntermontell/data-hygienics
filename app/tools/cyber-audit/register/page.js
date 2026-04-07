"use client"

import Navbar from "@/app/components/Navbar"
import AuthForm from "../components/AuthForm"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-20">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/tools/cyber-audit" className="flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors">
              <Shield className="w-5 h-5 text-[#1D4ED8]" />
              <span className="text-sm font-semibold tracking-wide uppercase">Cyber Audit</span>
            </Link>
          </div>
          <AuthForm mode="register" />
        </div>
      </div>
    </div>
  )
}
