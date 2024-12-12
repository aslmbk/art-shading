import { supabase } from "@/supabase-client";

export const fetchCategories = async () => {
  const { data, error } = await supabase.from("category").select();
  if (error) {
    console.error(error);
  }
  return data;
};

export const fetchTypes = async () => {
  const { data, error } = await supabase.from("type").select();
  if (error) {
    console.error(error);
  }
  return data;
};

export const fetchTags = async () => {
  const { data, error } = await supabase.from("tags").select();
  if (error) {
    console.error(error);
  }
  return data;
};
