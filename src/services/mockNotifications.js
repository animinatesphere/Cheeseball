// Simple mock notifications service for local dev/demo
export function fetchMockNotifications() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 101,
          title: "Deposit confirmed",
          body: "Your deposit of ₦12,500 was confirmed.",
          time: "2m",
          read: false,
        },
        {
          id: 102,
          title: "Rate update",
          body: "BTC price moved by +2.4% in the last hour.",
          time: "1h",
          read: false,
        },
        {
          id: 103,
          title: "Promo applied",
          body: "Your promo CHEESE2026 gave ₦1,500 off.",
          time: "3d",
          read: true,
        },
        {
          id: 104,
          title: "Security alert",
          body: "New login from Chrome on Windows.",
          time: "4d",
          read: false,
        },
        {
          id: 105,
          title: "Payout processed",
          body: "Your payout of ₦50,000 was sent to your bank.",
          time: "6d",
          read: true,
        },
      ]);
    }, 420);
  });
}
