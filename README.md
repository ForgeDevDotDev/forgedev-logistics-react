# ForgeDev Logistics React

> React + Vite + TypeScript + Zustand frontend for delivery tracking and dispatch dashboard

**Part of [ForgeDev](https://forgedev.dev)** — Structured work simulation for junior developers.

---

## 📜 License

This project is dual-licensed:

| Version | License | Use Case |
|---------|---------|----------|
| Community | AGPL-3.0 | Free for personal and open-source use. Network service modifications must be published. |
| Commercial | Commercial License | For organizations that want to use this project without AGPL obligations. Contact **info@forgedev.dev** |

See [LICENSE](./LICENSE), [COMMERCIAL-LICENSE.md](./COMMERCIAL-LICENSE.md), and [CLA.md](./CLA.md) for details.

---

## 🤝 Contributing

Contributions are welcome! Please read:

- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution guide, revenue sharing model, and PR process
- [CLA.md](./CLA.md) — Contributor License Agreement (must sign before merging)

---

## 🏗 Project Structure

```
forgedev-logistics-react/
├── src/
│   ├── api/
│   │   └── index.ts          # API client + endpoint modules
│   ├── assets/
│   │   └── main.css          # Global styles
│   ├── components/
│   │   ├── OrderCard.tsx
│   │   ├── CourierCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── TrackingTimeline.tsx
│   │   ├── AssignCourierForm.tsx
│   │   └── RouteMap.tsx       # Map placeholder
│   ├── pages/
│   │   ├── DispatchDashboard.tsx
│   │   ├── CourierView.tsx
│   │   ├── TrackingView.tsx
│   │   ├── OrderDetail.tsx
│   │   └── CustomerList.tsx
│   ├── stores/
│   │   ├── orders.ts
│   │   ├── couriers.ts
│   │   ├── deliveries.ts
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env.example
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` and proxies `/api` to `http://localhost:3000`.

Start the backend first: [forgedev-logistics-backend](../forgedev-logistics-backend)

---

## 🗺️ Features

- **Dispatch Dashboard** — View all orders and available couriers, assign couriers to orders
- **Courier View** — See assigned deliveries and update delivery status
- **Tracking** — Public order tracking by tracking code
- **Order Detail** — Full order info with status history timeline
- **Customer List** — View customers extracted from orders

---

## 🔗 Links

- **ForgeDev:** https://forgedev.dev
- **GitHub Org:** https://github.com/ForgeDevDotDev
- **Contact:** info@forgedev.dev

---

## 📁 Related Repositories

| Repo | Type |
|------|------|
| forgedev-logistics-backend | Backend API |
| forgedev-logistics-vue | Vue Frontend |
