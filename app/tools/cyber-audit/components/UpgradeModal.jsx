"use client"

import { motion } from "framer-motion"
import { Lock, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UpgradeModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-8 text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
          <Lock className="w-7 h-7 text-blue-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Unlock Your Full Report
        </h2>
        <p className="text-zinc-400 text-sm mb-8">
          $49 one-time or $29/month with a subscription
        </p>

        <div className="grid gap-3 mb-6">
          {/* TODO: Connect Stripe */}
          <Button className="w-full" asChild>
            <Link href="/pricing">
              <span className="flex items-center gap-2">
                Buy One-Time Report
              </span>
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/pricing">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Subscribe & Save
              </span>
            </Link>
          </Button>
        </div>

        <p className="text-zinc-600 text-xs">
          Subscribers get unlimited reports, the news feed, and priority access to new tools.
        </p>
      </motion.div>
    </div>
  )
}
