import React, { useEffect, useState, useRef } from "react";
import { Centrifuge } from "centrifuge";

const ClientList = () => {
  const [value, setValue] = useState("-");
  const [clients, setClients] = useState([]);

  const centrifugeRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    // console.log("useEffect triggered");

    // Initialize Centrifuge client
    // console.log("Initializing Centrifuge client");
    const centrifugeInstance = new Centrifuge("ws://10.10.7.81:9000/connection/websocket", {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mjk2ODU2OTYsImlhdCI6MTcyOTA4MDg5Nn0.W3d-4P2OLvnPWfs0ODJc0gn0syAxYsOwTVm_olp-H-U", // Replace with your actual token
      debug: true, // Enable debug mode in Centrifuge client
    });

    // Set up event listeners for the Centrifuge client
    centrifugeInstance
      .on("connecting", (ctx) => {
        // console.log(`Centrifuge connecting: code=${ctx.code}, reason=${ctx.reason}`);
      })
      .on("connected", (ctx) => {
        // console.log(`Centrifuge connected: client ID=${ctx.client}, transport=${ctx.transport}`);
      })
      .on("disconnected", (ctx) => {
        // console.log(`Centrifuge disconnected: code=${ctx.code}, reason=${ctx.reason}`);
      })
      .on("error", (err) => {
        console.error("Centrifuge error:", err);
      })
      .on("state", (ctx) => {
        // console.log("Centrifuge state changed:", ctx.newState);
      });

    // Connect to the Centrifugo server
    // console.log("Connecting to Centrifugo server...");
    centrifugeInstance.connect();

    // console.log("Centrifuge Instance:", centrifugeInstance);

    // Subscribe to the desired channel
    const channelName = "channel"; // Ensure this is the correct channel name
    // console.log(`Subscribing to channel: ${channelName}`);
    const sub = centrifugeInstance.newSubscription(channelName);

    // Set up event listeners for the subscription
    sub
      .on("publication", (ctx) => {
        // console.log(`Publication received on channel '${channelName}':`, ctx.data);
        // Update the state with the received data
        setValue(ctx.data.value);
        setClients(ctx.data.clients || []);
        document.title = ctx.data.value;
      })
      .on("subscribing", (ctx) => {
        // console.log(`Subscribing to channel '${channelName}': code=${ctx.code}, reason=${ctx.reason}`);
      })
      .on("subscribed", (ctx) => {
        // console.log(`Subscribed to channel '${channelName}':`, ctx);
      })
      .on("unsubscribed", (ctx) => {
        // console.log(`Unsubscribed from channel '${channelName}': code=${ctx.code}, reason=${ctx.reason}`);
      })
      .on("error", (err) => {
        // console.error(`Subscription error on channel '${channelName}':`, err);
      });

    // Subscribe to the channel
    sub.subscribe();

    // Save instances for cleanup
    centrifugeRef.current = centrifugeInstance;
    subscriptionRef.current = sub;

    // Cleanup function when component unmounts
    return () => {
      // console.log("Cleanup function called");
      if (subscriptionRef.current) {
        // console.log("Unsubscribing from channel");
        subscriptionRef.current.unsubscribe();
      }
      if (centrifugeRef.current) {
        // console.log("Disconnecting Centrifuge client");
        centrifugeRef.current.disconnect();
      }
    };
  }, []);

  // Log rendering
  // console.log("Rendering component with value:", value);
  // console.log("Current clients:", clients);

  return (
    <div>
      <div id="counter">{value}</div>
      <h1>Client List</h1>
      <table>
        <thead>
          <tr>
            <th>Client ID</th>
            <th>Client Name</th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? (
            clients.map((client, index) => (
              <tr key={index}>
                <td>{client.id || "NA"}</td>
                <td>{client.name || "NA"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No clients available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
