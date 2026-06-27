import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string | null;
  message: string | null;
  created_at: string;
};

export const listEnquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Enquiry[]> => {
    const { data, error } = await context.supabase
      .from("enquiries")
      .select("id, name, email, phone, program, message, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });