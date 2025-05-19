# GitHub CRM

**GitHub CRM** is a powerful collaboration tool for managing GitHub repositories. It provides a centralized dashboard to track repositories, view their statistics, and collaborate with team members.

## 🚀 Features

- **Repository Management**: Add, update, and delete GitHub repositories
- **Real-time Statistics**: View stars, forks, and open issues count
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure login and session management

## 🧰 Tech Stack

### Frontend

- ⚛️ [React](https://react.dev/) with TypeScript
- ⚡ [Vite](https://vitejs.dev/) for fast development and build
- 📦 [Zustand](https://zustand-demo.pmnd.rs/) for state management
- 📋 [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for form validation
- 🎨 [TailwindCSS](https://tailwindcss.com/) for utility-first styling
- 🔤 [Lucide Icons](https://lucide.dev/) for consistent iconography
- ♿ [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- 📅 [date-fns](https://date-fns.org/) for date formatting

### Backend

- 🧱 [NestJS](https://nestjs.com/) framework
- 🐘 PostgreSQL database
- 🧬 [Sequelize](https://sequelize.org/) ORM
- 🔁 Redis for session management
- 🛡️ Passport.js for authentication

### DevOps

- 🐳 Docker & Docker Compose for containerization

---

## ⚙️ Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/github-crm.git
cd github-crm
```

**2. Create environment files**

Copy .env.example files and rename them:

```bash
cp .env.client.example .env.client
cp .env.server.example .env.server
cp .env.db.example .env.db
```

**3. Start the application**

```bash
docker-compose -f docker-compose.dev up
```

**4. Access the application**

- Frontend: [GitHub CRM](http://localhost:5173)
- Backend API: [Swagger](http://localhost:8080/api)
