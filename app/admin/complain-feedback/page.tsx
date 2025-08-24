import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/db"

// Mock data - in a real application, you would fetch this from your database
const feedbacks = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        subject: "Website Feedback",
        message: "I really like the new design of your website. It's much easier to navigate now.",
        createdAt: new Date("2023-05-15").toISOString(),
    },
    {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: null,
        subject: "Product Feedback",
        message: "The new product is amazing, but I think it could use more color options.",
        createdAt: new Date("2023-05-20").toISOString(),
    },
    {
        id: 3,
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.j@example.com",
        phone: "987-654-3210",
        subject: "Service Feedback",
        message: "Your customer service team was very helpful in resolving my issue quickly.",
        createdAt: new Date("2023-06-01").toISOString(),
    },
    {
        id: 4,
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah.w@example.com",
        phone: "555-123-4567",
        subject: "General Feedback",
        message: "I've been a customer for years and I'm always impressed with your service quality.",
        createdAt: new Date("2023-06-10").toISOString(),
    },
    {
        id: 4,
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah.w@example.com",
        phone: "555-123-4567",
        subject: "General Feedback",
        message: "I've been a customer for years and I'm always impressed with your service quality.",
        createdAt: new Date("2023-06-10").toISOString(),
    },
]

const suggestions = [
    {
        id: 1,
        subject: "Feature Suggestion",
        comment: "It would be great if you could add a dark mode to the application.",
        createdAt: new Date("2023-05-10").toISOString(),
    },
    {
        id: 2,
        subject: "UI Improvement",
        comment: "The buttons on the mobile version could be larger for better usability.",
        createdAt: new Date("2023-05-25").toISOString(),
    },
    {
        id: 3,
        subject: "New Product Idea",
        comment: "Have you considered creating a companion mobile app?",
        createdAt: new Date("2023-06-05").toISOString(),
    },
    {
        id: 4,
        subject: "Content Suggestion",
        comment: "More tutorial videos would be helpful for new users.",
        createdAt: new Date("2023-06-15").toISOString(),
    },
]

const complains = [
    {
        id: 1,
        subject: "Billing Issue",
        reason: "I was charged twice for my last subscription payment.",
        createdAt: new Date("2023-05-05").toISOString(),
    },
    {
        id: 2,
        subject: "Product Defect",
        reason: "The item I received was damaged upon arrival.",
        createdAt: new Date("2023-05-18").toISOString(),
    },
    {
        id: 3,
        subject: "Service Complaint",
        reason: "I've been waiting for a response from customer service for over a week.",
        createdAt: new Date("2023-06-02").toISOString(),
    },
    {
        id: 4,
        subject: "Website Error",
        reason: "I keep getting an error when trying to update my profile information.",
        createdAt: new Date("2023-06-12").toISOString(),
    },
]

export default async function ComplainFeedbackPage() {
    const feedbacks = await db.feedback.findMany()
    const suggestions = await db.suggestion.findMany()
    const complains = await db.complain.findMany()
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Feedback, Suggestions and Complaints</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Feedback Section */}
                <Card className="h-[600px] flex flex-col">
                    <CardHeader>
                        <CardTitle>Feedback</CardTitle>
                        <CardDescription>Customer feedback and suggestions</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[480px] w-full pr-4">
                            <div className="space-y-4">
                                {feedbacks.map((feedback) => (
                                    <Card key={feedback.id} className="border-l-4 border-l-primary">
                                        <CardHeader className="py-4 px-5">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-base">{feedback.subject}</CardTitle>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(feedback.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <CardDescription>
                                                From: {feedback.firstName} {feedback.lastName} ({feedback.email})
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="py-2 px-5">
                                            <p className="text-sm">{feedback.message}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Suggestions Section */}
                <Card className="h-[600px] flex flex-col">
                    <CardHeader>
                        <CardTitle>Suggestions</CardTitle>
                        <CardDescription>Ideas and improvements from users</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[480px] w-full pr-4">
                            <div className="space-y-4">
                                {suggestions.map((suggestion) => (
                                    <Card key={suggestion.id} className="border-l-4 border-l-emerald-500">
                                        <CardHeader className="py-4 px-5">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-base">{suggestion.subject}</CardTitle>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(suggestion.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="py-2 px-5">
                                            <p className="text-sm">{suggestion.comment}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Complaints Section */}
                <Card className="h-[600px] flex flex-col">
                    <CardHeader>
                        <CardTitle>Complaints</CardTitle>
                        <CardDescription>Issues reported by customers</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[480px] w-full pr-4">
                            <div className="space-y-4">
                                {complains.map((complain) => (
                                    <Card key={complain.id} className="border-l-4 border-l-red-500">
                                        <CardHeader className="py-4 px-5">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-base">{complain.subject}</CardTitle>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(complain.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="py-2 px-5">
                                            <p className="text-sm">{complain.reason}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile-friendly tabs view */}
            <div className="mt-8 md:hidden">
                <Tabs defaultValue="feedback">
                    <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="feedback">Feedback</TabsTrigger>
                        <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                        <TabsTrigger value="complaints">Complaints</TabsTrigger>
                    </TabsList>

                    <TabsContent value="feedback" className="h-[500px]">
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Feedback</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden">
                                <ScrollArea className="h-[380px] w-full pr-4">
                                    <div className="space-y-4">
                                        {feedbacks.map((feedback) => (
                                            <Card key={feedback.id} className="border-l-4 border-l-primary">
                                                <CardHeader className="py-4 px-5">
                                                    <CardTitle className="text-base">{feedback.subject}</CardTitle>
                                                    <CardDescription>
                                                        From: {feedback.firstName} {feedback.lastName}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="py-2 px-5">
                                                    <p className="text-sm">{feedback.message}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="suggestions" className="h-[500px]">
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Suggestions</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden">
                                <ScrollArea className="h-[380px] w-full pr-4">
                                    <div className="space-y-4">
                                        {suggestions.map((suggestion) => (
                                            <Card key={suggestion.id} className="border-l-4 border-l-emerald-500">
                                                <CardHeader className="py-4 px-5">
                                                    <CardTitle className="text-base">{suggestion.subject}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="py-2 px-5">
                                                    <p className="text-sm">{suggestion.comment}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="complaints" className="h-[500px]">
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Complaints</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden">
                                <ScrollArea className="h-[380px] w-full pr-4">
                                    <div className="space-y-4">
                                        {complains.map((complain) => (
                                            <Card key={complain.id} className="border-l-4 border-l-red-500">
                                                <CardHeader className="py-4 px-5">
                                                    <CardTitle className="text-base">{complain.subject}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="py-2 px-5">
                                                    <p className="text-sm">{complain.reason}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

