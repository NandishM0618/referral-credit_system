
# 🚀 Referral & Credit System

A full-stack referral program built for a digital product platform.  
Users can register, share their referral link, earn credits when their referred users make their first purchase, and track all activity on a modern dashboard.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js + TypeScript + Tailwind CSS + Zustand |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | Custom JWT + bcrypt password hashing |
| **Validation** | Server-side + client-side input checks |
| **Deployment** | Frontend (Vercel) + Backend (Render) |

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/NandishM0618/referral-credit_system.git
cd referral-credit_system
````

### 2. Setup Environment Variables

Create a file `.env` in `/referral-credit_system`:

```bash
MONGO_URI=mongodb+srv://user:pass@cluster/referralDB
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
PORT=8080
```

And one in `/frontend`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Install Dependencies

```bash
# backend
npm install
# frontend
cd src/frontend && npm install
```

### 4. Run Development Servers

```bash
# backend
npm run dev     # starts Express on :5000
# frontend
npm run dev     # starts Next.js on :3000
```

---

## 🧠 Architecture Overview

**Flow Summary**

1. User registers or logs in → JWT token issued.
2. Each user has a unique referral code + shareable link.
3. When someone registers using that link:

   * A Referral record is created (`pending`).
4. When the referred user makes their **first purchase**:

   * Both referrer and referred get +2 credits.
   * Referral status changes to `converted`.
5. Dashboard shows summary (Referrals / Conversions / Credits).

---

## 🧱 API Endpoints

### 🔐 Auth

| Method | Endpoint             | Description                                         |
| ------ | -------------------- | --------------------------------------------------- |
| POST   | `/api/auth/register` | Register user (optionally with referral code `?r=`) |
| POST   | `/api/auth/login`    | Login and receive JWT                               |
| POST   | `/api/auth/logout`   | Invalidate session (client removes token)           |

### 🔗 Referral

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| GET    | `/api/referral/link`      | Get user’s referral link |
| GET    | `/api/referral/dashboard` | Dashboard metrics        |

### 💰 Purchase

| Method | Endpoint        | Description                                     |
| ------ | --------------- | ----------------------------------------------- |
| POST   | `/api/purchase` | Simulate a purchase; first one triggers credits |

---

## 📊 Database Schema 

```mermaid
erDiagram
    USER {
        string _id
        string name
        string email
        string passwordHash
        string referralCode
        ObjectId referredBy
        number credits
    }

    REFERRAL {
        ObjectId _id
        ObjectId referrer
        ObjectId referredUser
        string status
    }

    PURCHASE {
        ObjectId _id
        ObjectId user
        number amount
        boolean isFirstPurchase
        boolean isCredited
    }

    USER ||--o{ REFERRAL : referrer
    USER ||--o{ PURCHASE : buyer
    REFERRAL }o--|| USER : referredUser
```

---

## 🧮 State Management (Zustand)

`userStore.ts` keeps `user`, `token`, and logout actions.
All Axios requests automatically attach JWT from store.

---

## 🧠 Security Highlights

* Passwords hashed using **bcrypt** (not plaintext).
* JWT used for authentication; no session IDs.
* Protected routes via `authMiddleware`.
* Secure environment variables with `.env`.

---

## 📦 Deployment

* **Frontend** → [Vercel](https://referral-credit-system-omega.vercel.app/)
* **Backend** → [Render](https://referral-creditsystem-production.up.railway.app/)

Set the same environment variables on the hosting platforms.

---

## 🎥 Deliverables

* **Live Demo URL:** [link](https://referral-creditsystem-production.up.railway.app/)

---

## ScreenShots 

1. Dashboard

<img width="1915" height="943" alt="Screenshot 2025-11-07 201407" src="https://github.com/user-attachments/assets/d4f5ad89-c449-421a-96af-40aa54ab7f44" />

2. Notification of Credited points

<img width="1917" height="951" alt="Screenshot 2025-11-07 201737" src="https://github.com/user-attachments/assets/f7748f4b-7c43-4439-9c2e-50ea5612f337" />

3. Sample Products

<img width="1919" height="948" alt="Screenshot 2025-11-07 201426" src="https://github.com/user-attachments/assets/7fe70456-a282-4efb-8c94-504663cb6335" />

---

## 🧠 UML / System Design Diagram


### **1. Component-Level Architecture**

<img width="2613" height="1682" alt="mermaid-diagram-2025-11-07-173410" src="https://github.com/user-attachments/assets/27d3f1b3-cbfe-47a1-8987-1a5b98205957" />

### **2. UML sequence diagram** 

<img width="2613" height="1682" alt="mermaid-diagram-2025-11-07-173442" src="https://github.com/user-attachments/assets/22746224-1870-466a-a020-d2e7beecee50" />

### **2. Sequence Flow (Sign-Up → Referral → Purchase)**

1. User A registers → gets referral code `A1234`.  
2. User B visits `/register?r=A1234`.  
3. Backend creates `Referral(referrer=A, referred=B, status=pending)`.  
4. User B makes first purchase → system detects `isFirstPurchase === true`.  
5. Add 2 credits to both users, update `Referral.status = "converted"`.  
6. Dashboard shows updated stats.

---

