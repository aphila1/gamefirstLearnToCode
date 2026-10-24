import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function LivePlayerCounter() {
  const [registeredPlayers, setRegisteredPlayers] = useState<number>(0);
  const [realtimeActive, setRealtimeActive] = useState<number>(1); // Defaults to 1 (you!)

  useEffect(() => {
    // 1. Fetch total registered account nodes from database metadata
    const fetchTotalPlayers = async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (!error && count !== null) {
        setRegisteredPlayers(count);
      }
    };

    fetchTotalPlayers();

    // 2. Initialize a True Real-Time Web Socket Channel
    const trackChannel = supabase.channel("online-lobby-tracker", {
      config: {
        presence: {
          key: "player-session",
        },
      },
    });

    // Listen for players joining or leaving the page
    trackChannel
      .on("presence", { event: "sync" }, () => {
        const newState = trackChannel.presenceState();
        // Count how many total browser connections are currently open in the state matrix
        const totalConnectedTabs = Object.keys(newState).length;
        setRealtimeActive(Math.max(1, totalConnectedTabs));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Tell the cloud room that this browser tab is active
          await trackChannel.track({ online_at: new Date().toISOString() });
        }
      });

    // Cleanup: Automatically disconnect when the player closes the tab or leaves the page
    return () => {
      supabase.removeChannel(trackChannel);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span
          style={{
            width: "8px",
            height: "8px",
            background: "#10b981",
            borderRadius: "50%",
            boxShadow: "0 0 8px #cbeb5a",
          }}
        />
        Network: <strong style={{ color: "#10b981" }}>ONLINE</strong>
      </span>
      <span>•</span>

      {/*This will be changed to show if you are online or offline even to the other players who will be online*/}
      <span>
        👥 Active Players:{" "}
        <strong style={{ color: "#10b981" }}>{realtimeActive} live</strong>
      </span>
      <span>•</span>
      {/*This will be changed to show the true values coming from the database*/}
      <span>
        Registered Players:{" "}
        <strong style={{ color: "#3b82f6" }}>{registeredPlayers} total</strong>
      </span>
    </div>
  );
}
