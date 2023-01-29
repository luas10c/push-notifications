import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

navigator.serviceWorker
  .register("/service-worker.js")
  .then(async (serviceWorker) => {
    let subscription = await serviceWorker.pushManager.getSubscription();
    if (!subscription) {
      const response = await fetch("http://localhost:4000/push/public_key");
      const data = await response.json();

      subscription = await serviceWorker.pushManager.subscribe({
        applicationServerKey: data.publicKey,
        userVisibleOnly: true,
      });
    }

    await fetch("http://localhost:4000/push/register", {
      method: "POST",
      body: JSON.stringify({ subscription }),
    });

    console.log(subscription);
  });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
