"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const infoItems = [
  { label: "Strategy sessions", value: "Free 30-min call" },
  { label: "Response time", value: "Within 24 hours" },
  { label: "Based in", value: "Available remote" },
]

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState("idle") // idle | sending | success | error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("sending")

    try {
      const res = await fetch("https://formspree.io/f/mdkeovqy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus("success")
        setFormData({ name: "", email: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="py-32 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-28 items-start">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-lime-400 text-xs font-semibold tracking-widest uppercase">
              Get In Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-6 leading-tight tracking-tight">
              Let&apos;s build
              <br />
              something.
            </h2>
            <p className="text-zinc-500 leading-relaxed mb-10">
              Have a project in mind? Curious about AI tools for your business?
              Or just want to say hi — I&apos;m genuinely happy to hear from you.
            </p>

            <div className="space-y-4">
              {infoItems.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 py-3 border-b border-zinc-800/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0" />
                  <span className="text-zinc-500 text-sm">{label}</span>
                  <span className="text-zinc-200 text-sm font-medium ml-auto">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {status === "success" ? (
              <div className="rounded-2xl border border-lime-400/15 bg-lime-400/[0.04] p-12 text-center">
                <div className="w-14 h-14 rounded-full bg-lime-400/10 border border-lime-400/20 flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-6 h-6 text-lime-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Message received.
                </h3>
                <p className="text-zinc-500 text-sm">
                  I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me what you're working on..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="min-h-[140px]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send Message →"}
                </Button>
                {status === "error" && (
                  <p className="text-red-400 text-sm text-center">
                    Something went wrong — please try again.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
