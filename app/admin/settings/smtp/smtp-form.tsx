"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "react-toastify"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
// import { testSmtpConnection } from "./actions"
import { Textarea } from "@/components/ui/textarea"
// import { TestEmailDialog } from "./test-email-dialog"

const smtpFormSchema = z.object({
  host: z.string().min(1, { message: "SMTP host is required" }),
  port: z.string().min(1, { message: "Port is required" }),
  username: z.string().min(1, { message: "Username is required" }).optional(),
  password: z.string().min(1, { message: "Password is required" }).optional(),
  encryption: z.enum(["none", "ssl", "tls"]),
  fromEmail: z.string().email({ message: "Please enter a valid email address" }),
  to: z.string().min(1, { message: "From name is required" }),
  subject: z.string(),
  enableAuth: z.boolean().default(true),
})

type SmtpFormValues = z.infer<typeof smtpFormSchema>

const defaultValues: Partial<SmtpFormValues> = {
  host: "",
  port: "587",
  username: "",
  password: "",
  encryption: "tls",
  fromEmail: "",
  to: "",
  subject: "",
  enableAuth: true,
}

export function SmtpSettingsForm() {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isTesting, setIsTesting] = useState<boolean>(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const form = useForm<SmtpFormValues>({
    resolver: zodResolver(smtpFormSchema),

    defaultValues,
  })

  async function onSubmit(data: SmtpFormValues) {
    setIsSaving(true)

    const response = await fetch(`/api/email`, {
      method: "POST",
      body: JSON.stringify({ ...data }),
    })

    console.log(response)
    console.log(data)
    setIsSaving(false)
    if (response.status === 200) {
      toast("Your SMTP settings have been saved successfully.")
    } else {
      toast(response.statusText)
    }
  }

  // async function handleTestConnection() {
  //   const values = form.getValues()

  //   // Validate form before testing
  //   // const result = await form.trigger(["host", "port", "fromEmail"])
  //   // if (!result) {
  //   //   toast({
  //   //     title: "Validation Error",
  //   //     description: "Please fill in all required fields correctly.",
  //   //     variant: "destructive",
  //   //   })
  //   //   return
  //   // }

  //   setIsTesting(true)
  //   setTestResult(null)

  //   try {
  //     const testData = {
  //       ...values,
  //       // If authentication is disabled, don't send credentials
  //       username: values.enableAuth ? values.username : undefined,
  //       password: values.enableAuth ? values.password : undefined,
  //     }

  //     // const result = await testSmtpConnection(testData)

  //     setTestResult({
  //       success: result.success,
  //       message: result.message,
  //     })

  //     if (result.success) {
  //       toast({
  //         title: "Connection Successful",
  //         description: "SMTP connection test was successful.",
  //       })
  //     } else {
  //       toast({
  //         title: "Connection Failed",
  //         description: result.message,
  //         variant: "destructive",
  //       })
  //     }
  //   } catch (error) {
  //     setTestResult({
  //       success: false,
  //       message: error instanceof Error ? error.message : "An unknown error occurred",
  //     })

  //     toast({
  //       title: "Test Failed",
  //       description: "Could not complete the SMTP test. Please check your settings.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsTesting(false)
  //   }
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMTP Settings</CardTitle>
        <CardDescription>Configure your SMTP server for sending emails from your application.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Host</FormLabel>
                    <FormControl>
                      <Input placeholder="smtp.example.com" {...field} />
                    </FormControl>
                    <FormDescription>The hostname of your SMTP server.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input placeholder="587" {...field} />
                    </FormControl>
                    <FormDescription>Common ports: 25, 465, 587, 2525</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="encryption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Encryption</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select encryption type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The encryption method used by your SMTP server.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableAuth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Authentication</FormLabel>
                    <FormDescription>Enable if your SMTP server requires authentication.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Subject</FormLabel>
                    <Textarea {...field} className="w-full" />
                    {/* <FormDescription>Write your subject for receipent</FormDescription> */}
                  </div>

                </FormItem>
              )}
            />

            {form.watch("enableAuth") && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fromEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Email</FormLabel>
                    <FormControl>
                      <Input placeholder="noreply@example.com" {...field} />
                    </FormControl>
                    <FormDescription>The email address that will appear in the "From" field.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company Name" {...field} />
                    </FormControl>
                    <FormDescription>The name that will appear in the "From" field.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{testResult.success ? "Connection Successful" : "Connection Failed"}</AlertTitle>
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                type="submit"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Save
              </Button>
              {/* <TestEmailDialog smtpConfig={form.getValues()} /> */}
            </div>
            {/* <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? "Saving..." : "Save changes"}
            </Button> */}
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

