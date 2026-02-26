import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import '../index.css'

export const rootRoute = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card p-4">
        <div className="container mx-auto flex gap-4">
            <Link
                to="/"
                className="font-medium"
            >
                FakeIdentity
            </Link>
          <Link
            to="/"
            className="text-foreground hover:text-primary transition-colors [&.active]:text-primary [&.active]:font-semibold"
          >
            Users
          </Link>
          <Link
            to="/about"
            className="text-foreground hover:text-primary transition-colors [&.active]:text-primary [&.active]:font-semibold"
          >
            Applications
          </Link>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
