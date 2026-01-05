import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@starter/ui";
import { Calendar, MessageSquare, ShieldCheck, UserCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center px-4 py-10 space-y-8 max-w-4xl mx-auto w-full">
      <section className="text-center space-y-4">
        <Badge variant="outline" className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-600 border-blue-200 bg-blue-50">
          Product Discovery Mode
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-gray-900">
          Welcome to your health dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Securely manage appointments, chat with clinical agents, and access your health records from anywhere.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 w-full sm:grid-cols-2">
        <Card className="hover:border-blue-300 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Appointments</CardTitle>
              <CardDescription>Schedule and manage visits</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full mt-2" disabled>
              Open Booking
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-300 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Care Chat</CardTitle>
              <CardDescription>Talk to our clinical agents</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full mt-2" disabled>
              Start Conversation
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-300 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Profile</CardTitle>
              <CardDescription>Manage personal information</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full mt-2" disabled>
              View Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-300 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Privacy</CardTitle>
              <CardDescription>Security and consent settings</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full mt-2" disabled>
              Check Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-4 max-w-lg w-full">
        <div className="p-1 bg-yellow-100 rounded-full text-yellow-700 mt-1">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <h4 className="font-semibold text-yellow-900 text-sm">Security Note</h4>
          <p className="text-yellow-800 text-sm mt-1">
            This is a preview environment. No clinical data is being processed, and all features are currently simulated for architectural discovery.
          </p>
        </div>
      </div>
    </div>
  );
}
