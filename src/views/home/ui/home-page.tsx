import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from '@/shared/ui'

function HomePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to Pro Grid Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            A modern Vite + React + TypeScript project with FSD architecture and shadcn/ui
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature-Sliced Design</CardTitle>
              <CardDescription>
                Organized project structure following FSD methodology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Entities layer for business entities</li>
                <li>✓ Features layer for user scenarios</li>
                <li>✓ Widgets layer for composite UI blocks</li>
                <li>✓ Pages layer for application pages</li>
                <li>✓ Shared layer for reusable code</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>shadcn/ui Components</CardTitle>
              <CardDescription>
                Beautiful and accessible components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Fully customizable with Tailwind CSS</li>
                <li>✓ TypeScript support out of the box</li>
                <li>✓ Accessible by default</li>
                <li>✓ Copy and paste components</li>
                <li>✓ Open source</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Try the Components</CardTitle>
            <CardDescription>
              See shadcn/ui components in action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button variant="default">Submit</Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Delete</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>
              Various button styles and sizes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" variant="outline">
              <span>🎨</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export { HomePage }

