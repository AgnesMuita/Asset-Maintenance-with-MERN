import React from 'react'
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog'
// import { Resend } from 'resend'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from './ui/use-toast'
import { Input } from './ui/input'
// import PasswordForgot from '@/emails/PasswordForgot';

// const resend = new Resend(process.env.REACT_APP_RESEND_KEY)

const passwordFormSchema = z.object({
    email: z.string({
        required_error: "Email is required.",
    }),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const ForgotPassword: React.FunctionComponent = () => {
    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        mode: "onChange",
    });

    async function onPasswordSubmit(passwordFormData: PasswordFormValues) {
        try {

            toast({
                title: "You submitted your form with following values:",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
                        <code className="text-white text-wrap">
                            {JSON.stringify(passwordFormData, null, 2)}
                        </code>
                    </pre>
                ),
            });

            passwordForm.reset({
                email: ""
            })
        } catch (error) {
            toast({
                title: "Encountered an error!",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
                        <code className="text-white text-wrap">
                            {`Error - ${error}`}
                        </code>
                    </pre>
                ),
            });
        }
    }

    return (
        <div>
            <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} id='passwordForm'>
                    <AlertDialogContent className="w-[35rem]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-semibold text-xl tracking-tight">
                                Forgot Password
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                <FormField
                                    control={passwordForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Please enter your email below</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="m@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>An email will be
                                                sent to your
                                                administrator to
                                                reset your password.
                                                Make sure the email
                                                you enter is a valid
                                                email and the one
                                                you use for this
                                                app.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-2">
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction type='submit' form='passwordForm'>
                                Request Reset
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </form>
            </Form>
        </div>
    )
}

export default ForgotPassword