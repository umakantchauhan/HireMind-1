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
import { User, Bell, Palette, Building } from 'lucide-react';

// Define Zod schema for profile form validation
const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Default values for the profile form
const defaultProfileValues: Partial<ProfileFormValues> = {
  fullName: "John Doe",
  jobTitle: "Senior Technical Recruiter",
  companyName: "Tech Solutions Inc.",
  email: "john.doe@techsolutions.com",
};

export default function SettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultProfileValues,
  });

  function onProfileSubmit(data: ProfileFormValues) {
    console.log("Profile data submitted:", data);
    // Here you would typically handle the API call to update the user's profile
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
                Manage your account settings and preferences.
            </p>
        </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="account"><Building className="mr-2 h-4 w-4" />Account</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Notifications</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4" />Appearance</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onProfileSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...register("fullName")} />
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" {...register("jobTitle")} />
                   {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" {...register("companyName")} />
                  {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="picture">Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <Input id="picture" type="file" className="max-w-xs" />
                    </div>
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
                <CardTitle>Account</CardTitle>
                <CardDescription>
                    Update your account settings. Set your preferred language and timezone.
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
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                </div>
                 <Separator />
                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <div className="flex items-center space-x-2">
                     <Switch id="2fa-switch" />
                     <Label htmlFor="2fa-switch">Enable 2FA</Label>
                  </div>
                   <p className="text-sm text-muted-foreground">
                    Enhance your account security by enabling two-factor authentication.
                  </p>
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
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive emails about important events.</p>
              </div>
              <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <Label htmlFor="new-candidate">New Candidate Applies</Label>
                  <Switch id="new-candidate" defaultChecked/>
              </div>
               <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <Label htmlFor="interview-complete">Interview Completed</Label>
                  <Switch id="interview-complete" defaultChecked/>
              </div>
               <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <Label htmlFor="interview-scheduled">Interview Scheduled</Label>
                  <Switch id="interview-scheduled" />
              </div>
               <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <Label htmlFor="weekly-summary">Weekly Summary</Label>
                  <Switch id="weekly-summary" defaultChecked/>
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