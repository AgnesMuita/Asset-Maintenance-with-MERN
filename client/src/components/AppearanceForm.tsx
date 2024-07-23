"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { useTheme } from "@/context/theme-provider";
import { useFont } from "@/context/font-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
  font: z.enum(["inter", "manrope", "roboto", "roboto-mono", "ubuntu", "ubuntu-mono", "open-sans", "titillium-web", "quicksand", "inconsolata", "merriweather", "pt-sans", "rubik", "poppins", "montserrat", "System"], {
    invalid_type_error: "Select a font",
  }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

const defaultValues: Partial<AppearanceFormValues> = {
  theme: "light",
  font: "inter"
};

export function AppearanceForm() {
  const { theme, setTheme } = useTheme()
  const { font, setFont } = useFont()

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  });

  function onSubmit(data: AppearanceFormValues) {
    setFont(data.font)
    setTheme(data.theme);
    toast({
      title: "Theme/Font Change",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-green-500 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <ScrollArea className="h-[calc(100vh-17.1rem)]">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pl-2">
          <FormField
            control={form.control}
            name="font"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={font}
                >
                  <FormControl>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue
                        className="placeholder:text-muted-foreground"
                        placeholder="Select category..."
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="inter">
                      Inter
                    </SelectItem>
                    <SelectItem value="manrope">
                      Manrope
                    </SelectItem>
                    <SelectItem value="roboto">
                      Roboto
                    </SelectItem>
                    <SelectItem value="roboto-mono">
                      Roboto Mono
                    </SelectItem>
                    <SelectItem value="open-sans">
                      Open Sans
                    </SelectItem>
                    <SelectItem value="ubuntu">
                      Ubuntu
                    </SelectItem>
                    <SelectItem value="ubuntu-mono">
                      Ubuntu Mono
                    </SelectItem>
                    <SelectItem value="titillium-web">
                      Tittilium Web
                    </SelectItem>
                    <SelectItem value="quicksand">
                      Quicksand
                    </SelectItem>
                    <SelectItem value="inconsolata">
                      Inconsolata
                    </SelectItem>
                    <SelectItem value="merriweather">
                      Merriweather
                    </SelectItem>
                    <SelectItem value="pt-sans">
                      PT Sans
                    </SelectItem>
                    <SelectItem value="rubik">
                      Rubik
                    </SelectItem>
                    <SelectItem value="poppins">
                      Poppins
                    </SelectItem>
                    <SelectItem value="montserrat">
                      Montserrat
                    </SelectItem>
                    <SelectItem value="System">
                      System
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Set the font you want to use in the application.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Theme</FormLabel>
                <FormDescription>
                  Select the theme for the dashboard.
                </FormDescription>
                <FormMessage />
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid max-w-md grid-cols-2 gap-8 pt-2"
                >
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary has-[:light]:border-primary">
                      <FormControl>
                        <RadioGroupItem value="light" className="sr-only" />
                      </FormControl>
                      <div className={theme === "light" ? "items-center rounded-md border-2 border-muted p-1 hover:border-accent" : "items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground"}>
                        <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                          <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal">
                        Light
                      </span>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary has-[:dark]:border-primary">
                      <FormControl>
                        <RadioGroupItem value="dark" className="sr-only" />
                      </FormControl>
                      <div className={theme === "dark" ? "items-center rounded-md border-2 border-muted p-1 hover:border-accent" : "items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground"}>
                        <div className="space-y-2 rounded-sm p-2">
                          <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal">
                        Dark
                      </span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormItem>
            )}
          />

          <Button type="submit">Update preferences</Button>
        </form>
      </ScrollArea>
    </Form>
  );
}
