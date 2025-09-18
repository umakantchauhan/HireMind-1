"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Palette, Lock } from 'lucide-react';

// Define Zod schema for profile form validation
const candidateProfileSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email(),
  phone: z.string().optional(),
  portfolio: z.string().url({ message: "Please enter a valid URL." }).optional(),
});

type CandidateProfileValues = z.infer<typeof candidateProfileSchema>;

// Default values for the profile form
const defaultCandidateValues: Partial<CandidateProfileValues> = {
  fullName: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "123-456-7890",
  portfolio: "https://janedoe.dev"
};

export default function CandidateSettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CandidateProfileValues>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: defaultCandidateValues,
  });

  function onProfileSubmit(data: CandidateProfileValues) {
    console.log("Candidate profile data submitted:", data);
    // Handle API call to update candidate profile
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
                Manage your profile, account, and notification preferences.
            </p>
        </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="account"><Lock className="mr-2 h-4 w-4" />Account</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Notifications</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4" />Appearance</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Keep your personal information up to date.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onProfileSubmit)}>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="picture">Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <Input id="picture" type="file" className="max-w-xs" />
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...register("fullName")} />
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" {...register("phone")} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio/Website (Optional)</Label>
                  <Input id="portfolio" {...register("portfolio")} />
                   {errors.portfolio && <p className="text-sm text-red-500">{errors.portfolio.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="resume">Your Resume</Label>
                     <p className="text-sm text-muted-foreground">Upload your latest resume (PDF format).</p>
                    <Input id="resume" type="file" accept=".pdf" className="max-w-xs pt-1.5" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                    Manage your password and account settings.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                </div>
                 <Separator />
                 <div className="space-y-2">
                    <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive">Delete My Account</Button>
                </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                <Button>Update Password</Button>
                </CardFooter>
            </Card>
        </TabsContent>


        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose how you want to be notified about your applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Email Notifications</h3>
              </div>
              <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <Label htmlFor="app-status">Application Status Updates</Label>
                  <Switch id="app-status" defaultChecked/>
              </div>
               <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <Label htmlFor="interview-reminders">Interview Reminders</Label>
                  <Switch id="interview-reminders" defaultChecked/>
              </div>
               <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <Label htmlFor="new-jobs">New Job Postings</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new jobs that match your profile.</p>
                  <Switch id="new-jobs" />
              </div>
            </CardContent>
             <CardFooter className="border-t px-6 py-4">
                <Button>Save Preferences</Button>
              </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
           <Card>
                <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                    Customize the look and feel of the application.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                     <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
                    <div className="flex items-center space-x-2 pt-2">
                        <Button variant="outline" onClick={() => document.documentElement.classList.remove('dark')}>Light</Button>
                        <Button variant="outline" onClick={() => document.documentElement.classList.add('dark')}>Dark</Button>
                    </div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English (United States)</SelectItem>
                        <SelectItem value="es">Español (España)</SelectItem>
                        <SelectItem value="fr">Français (France)</SelectItem>
                        <SelectItem value="de">Deutsch (Deutschland)</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </CardContent>
                 <CardFooter className="border-t px-6 py-4">
                    <Button>Save Appearance Settings</Button>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

