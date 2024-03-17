import { supabase } from "app/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { formatRelative } from "date-fns";
import { userFastedRecord } from "../types/types";

export const startTimer = (countdownHours: number, startTime?: number) => {
  // If a startTime is provided, use it; otherwise, use the current time
  const startTimestamp = startTime || new Date().getTime();
  const targetTime = startTimestamp + countdownHours * 60 * 60 * 1000;

  const interval = setInterval(() => {
    const currentTime = new Date().getTime();
    const distance = targetTime - currentTime;
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      clearInterval(interval);
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    } else {
      return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      };
    }
  }, 1000);

  return () => clearInterval(interval);
};

export const insertFastedStartRow = async (
  hours: number,
  started_at: string | null,
  refetch: () => void
) => {
  const user = await supabase.auth.getUser();

  const data = await supabase.from("fasted").insert({
    hours,
    started_at,
    user_id: user?.data.user?.id,
  });

  return data;
};

/**
 * We want the lastest fasted row. To see if the user is currently fasting. Then we want to return that row.
 * So the timer can continue.
 */
export const userFastedRecords = async () => {
    try {
      const user = await supabase.auth.getUser();
      const id = user.data.user?.id;
      if (!id) {
        return null;
      }
  
      const { data, error } = await supabase
        .from("fasted")
        .select("hours, started_at")
        .eq("user_id", id)
        .order("started_at", { ascending: false })
        .limit(1);
  
      if (error) {
        throw error; // Or handle it as per your application's error handling policy
      }
  
      return data?.[0] || null; // Directly return the first record or null if it doesn't exist
    } catch (error) {
      console.error("Error fetching fasted row", error);
      return null; // Or handle the error as needed
    }
  };


/** Custom hook for getting user fasted records */
export const useUserFastedRecords = () => {
    return useQuery({
      queryKey: ["userFastedRecords"],
      queryFn: userFastedRecords,
    });
  };




export const startedAt = (startedAt: string) => {
    return startedAt
      ? formatRelative(new Date(startedAt), new Date())
      : "Not started"
  }

export const chosenHours = (data: userFastedRecord | null) => {
    return data?.hours ? data?.hours : 0
  }

  // calculate end of fast based on chosen hours and start time
 export const endOfFast = (data: userFastedRecord | null) => {
    if (!data?.started_at || !data.hours) return "Not started"
    // Convert the start date string to a Date object
    const startDate = new Date(data.started_at)
    // Calculate the end date by adding the fast duration (in hours) to the start date
    const endDate = new Date(startDate.getTime() + data.hours * 60 * 60 * 1000)
    // Format the end date relative to the current date and return it
    return formatRelative(endDate, new Date())
  }

  export const calculateTimeLeftOfFast = (data: userFastedRecord | null) => {
    if (!data?.started_at || !data?.hours) return "Not started"
    const startDate = new Date(data.started_at)
    const endDate = new Date(startDate.getTime() +  data.hours * 60 * 60 * 1000)
    const now = new Date()
    const timeLeft = endDate.getTime() - now.getTime()

    if (timeLeft < 0) {
      return null
    } else {
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((timeLeft / 1000 / 60) % 60)
      const seconds = Math.floor((timeLeft / 1000) % 60)
      return `${hours}h ${minutes}m ${seconds}s`
    }
  }