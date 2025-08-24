"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Loader2, Mail } from "lucide-react"

type SmtpConfig = {
  host: string
  port: string
  username?: string
  password?: string
  encryption: "none" | "ssl" | "tls"
  fromEmail: string
  fromName: string
  enableAuth: boolean
}

export function TestEmailDialog({ smtpConfig }: { smtpConfig: SmtpConfig }) {
  const [open, setOpen] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [isSending, setIsSending] = useState(false)

  async function handleSendTestEmail() {
    if (!testEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the test to.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      const response = await fetch("/settings/smtp/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...smtpConfig,
          testEmail,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Test Email Sent",
          description: `A test email was successfully sent to ${testEmail}`,
        })
        setOpen(false)
      } else {
        toast({
          title: "Failed to Send Test Email",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while sending the test email.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          <Mail className="mr-2 h-4 w-4" />
          Send Test Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Test Email</DialogTitle>
          <DialogDescription>
            Send a test email to verify your SMTP configuration is working correctly.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="test-email" className="col-span-4">
              Recipient Email
            </Label>
            <Input
              id="test-email"
              placeholder="recipient@example.com"
              className="col-span-4"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSendTestEmail} disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Test Email"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

