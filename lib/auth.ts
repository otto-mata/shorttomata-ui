"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: api.me,
    retry: false,
    staleTime: 5 * 60_000,
  });
