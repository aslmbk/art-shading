import { fetchCategories, fetchTypes, fetchTags } from "@/lib/api";
import { useEffect } from "react";
import { useData } from "@/store/data";

export const useFetchData = () => {
  useEffect(() => {
    const { setCategories, setTypes, setTags } = useData.getState();
    fetchCategories().then((categories) => {
      console.log("categories", categories);
      setCategories(categories || []);
    });
    fetchTypes().then((types) => {
      console.log("types", types);
      setTypes(types || []);
    });
    fetchTags().then((tags) => {
      console.log("tags", tags);
      setTags(tags || []);
    });
  }, []);
};
