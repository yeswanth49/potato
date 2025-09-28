# My v0 Project

A simple Next.js project built with modern technologies. This project serves as a starting point for building a web application with a focus on a great developer experience and a robust feature set.

## Getting Started

To get the project up and running on your local machine, follow these steps.

### Prerequisites

Make sure you have [pnpm](https://pnpm.io/installation) installed.

### Installation & Setup

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd my-v0-project
    ```
3.  Install the dependencies:
    ```bash
    pnpm install
    ```
4.  Run the development server:
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Tech Stack

This project is built with the following technologies:

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) (built on Radix UI)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Project Structure

The project follows a standard Next.js `app` directory structure:

```
.
├── app/              # Application routes and pages
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and library configurations
├── public/           # Static assets (images, fonts, etc.)
└── styles/           # Global styles
```

-   `app/`: Contains all the routes, pages, and layouts for the application.
-   `components/`: Home to all the reusable UI components used throughout the application.
-   `hooks/`: Stores custom React hooks for shared logic.
-   `lib/`: Includes helper functions, utility classes, and library-specific configurations.
-   `public/`: Static files that are served directly, such as images, favicons, and `robots.txt`.
-   `styles/`: Global stylesheets and Tailwind CSS configuration.

## Available Scripts

In the `package.json` file, you will find the following scripts:

-   `pnpm dev`: Runs the application in development mode with hot-reloading.
-   `pnpm build`: Compiles and builds the application for production.
-   `pnpm start`: Starts the production server for the built application.
-   `pnpm lint`: Lints the codebase to check for code quality and style issues.