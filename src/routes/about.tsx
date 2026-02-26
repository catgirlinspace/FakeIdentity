import { createRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { rootRoute } from './__root'

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a demo application built with Bun, React, and TanStack Router.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
