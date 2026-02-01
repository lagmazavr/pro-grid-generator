import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui'
import type { User } from '../model/types'

interface UserCardProps {
  user: User
}

function UserCard({ user }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">User ID: {user.id}</p>
      </CardContent>
    </Card>
  )
}

export { UserCard }

