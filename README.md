
# Digital Wallet API

## 📌 Project Overview

This project is a secure, modular, and role-based backend API for a digital wallet system (similar to Bkash or Nagad) built using Express.js and Mongoose.

The system allows users to register, manage wallets, and perform core financial operations such as add money, withdraw, and send money. It also supports agents and admins with role-based permissions.

## 🚀 Features

### 🔐 Authentication & Authorization

- JWT-based login system with three roles: admin, user, agent

- Secure pin hashing (bcrypt)

- Role-based route protection middleware

### 👤 User Features

- Automatic wallet creation on registration (initial balance: ৳50)
- Add money (top-up)

- Withdraw money

- Send money to another user

- View wallet balance & transaction history

### 🧑‍💼 Agent Features

- Add money to any user's wallet (cash-in)

- Withdraw money from any user's wallet (cash-out)

- View commission history

### 🛡️ Admin Features

- View all users, agents, wallets, and transactions

- Block/unblock user wallets

- Approve/suspend agents

### 💰 Transactions

- All transactions are stored and trackable

- Supports types: add_money, withdraw, send_money, received_money,cash-in, cash-out,commission,fee

- Atomic balance update with transaction record

- Statuses: pending, completed, reversed

## 📜 API Endpoints (Sample)

### 🔑 Auth

- POST /auth/login → Login and receive JWT

### 👤 User

- POST /user/register → Register new user/agent

- POST /wallet/add-money → Add money

- POST /wallet/withdraw-money → Withdraw money

- POST /wallet/send-money → Send money to another user

- GET /wallet/me → Get my wallet details

- GET /transactions/me → View my transactions

### 🧑‍💼 Agent

- POST /wallet/cash-in → Cash-in to a user

- POST /wallet/cash-out → Cash-out from a user

- GET /transactions/commission → View commission history 

### 🛡️ Admin

- PATCH /admin/wallets/block/:id → Block wallet

- PATCH /admin/wallets/unblock/:id → Unblock wallet

- PATCH /admin/agents/approve/:id → Approve agent

- PATCH /admin/agents/suspend/:id → Suspend agent

- GET /admin/users → View all users

- GET /admin/agents → View all agents

- GET /admin/wallets → View all wallets

- GET /admin/transactions → view all transactions



### 🏗️  Project Structure

```markdown
- src/
  - modules/
    - auth/
    - user/
    - wallet/
    - transaction/
  - middlewares/
  - error/
  - config/
  - utils/
  - app.ts
  - server.ts




