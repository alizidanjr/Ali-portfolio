"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name is required",
    }),
    email: z.string().email({
        message: "Valid email is required",
    }),
    serviceType: z.string().min(1, {
        message: "Select a service",
    }),
    date: z.date({
        message: "Select a date",
    }),
    message: z.string().min(10, {
        message: "Tell me more about your project",
    }),
})

type SubmitStatus = "idle" | "loading" | "success" | "error"

export function BookingForm() {
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
    const [statusMessage, setStatusMessage] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setSubmitStatus("loading")
        setStatusMessage("")

        try {
            const response = await fetch("/api/booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    date: values.date.toISOString(),
                }),
            })

            const data = await response.json()

            if (data.success) {
                setSubmitStatus("success")
                setStatusMessage("Request Sent. I'll be in touch.")
                form.reset()
            } else {
                setSubmitStatus("error")
                setStatusMessage(data.error || "Failed to send.")
            }
        } catch {
            setSubmitStatus("error")
            setStatusMessage("Network error.")
        }
    }

    const isLoading = submitStatus === "loading"

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] md:text-xs uppercase tracking-widest text-primary/70 font-bold">Your Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Full Name"
                                        className="h-12 md:h-14 bg-white/5 border-0 border-b border-white/10 rounded-xl px-4 text-lg md:text-xl focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-muted-foreground/30 glass-morphism"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] uppercase font-bold" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] md:text-xs uppercase tracking-widest text-primary/70 font-bold">Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="hello@example.com"
                                        className="h-12 md:h-14 bg-white/5 border-0 border-b border-white/10 rounded-xl px-4 text-lg md:text-xl focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-muted-foreground/30 glass-morphism"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] uppercase font-bold" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] md:text-xs uppercase tracking-widest text-primary/70 font-bold">Project Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 md:h-14 bg-white/5 border-0 border-b border-white/10 rounded-xl px-4 text-lg md:text-xl focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all glass-morphism">
                                            <SelectValue placeholder="Select Service" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-background border-primary/20 backdrop-blur-xl">
                                        <SelectItem value="photography">Photography</SelectItem>
                                        <SelectItem value="videography">Videography</SelectItem>
                                        <SelectItem value="both">Full Production</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-[10px] uppercase font-bold" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-[10px] md:text-xs uppercase tracking-widest text-primary/70 font-bold">Preferred Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"ghost"}
                                                className={cn(
                                                    "h-12 md:h-14 w-full pl-4 text-left font-normal border-0 border-b border-white/10 rounded-xl text-lg md:text-xl hover:bg-white/10 hover:text-primary transition-all glass-morphism",
                                                    !field.value && "text-muted-foreground/30"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Select Date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-background border-primary/20 backdrop-blur-xl" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage className="text-[10px] uppercase font-bold" />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] md:text-xs uppercase tracking-widest text-primary/70 font-bold">Project Details</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell me your vision..."
                                    className="min-h-[100px] md:min-h-[120px] bg-white/5 border-0 border-b border-white/10 rounded-xl px-4 text-lg md:text-xl focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-muted-foreground/30 resize-none py-4 glass-morphism"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />

                {/* Status Message */}
                <AnimatePresence>
                    {statusMessage && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className={cn(
                                "flex items-center gap-3 p-4 rounded-xl text-sm font-bold uppercase tracking-wider",
                                submitStatus === "success" && "bg-primary/10 text-primary border border-primary/20",
                                submitStatus === "error" && "bg-red-500/10 text-red-500 border border-red-500/20"
                            )}
                        >
                            {submitStatus === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                            {submitStatus === "error" && <XCircle className="w-5 h-5 flex-shrink-0" />}
                            <span>{statusMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    type="submit"
                    size="lg"
                    className="w-full h-16 text-xl font-black uppercase tracking-[0.2em] group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_10px_30px_rgba(255,102,0,0.3)]"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                            Sending
                        </>
                    ) : (
                        <>
                            Submit Request
                            <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                        </>
                    )}
                </Button>
            </form>
        </Form>
    )
}
