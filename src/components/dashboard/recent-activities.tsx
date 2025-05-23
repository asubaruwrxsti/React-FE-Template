import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivities() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">New lease signed</p>
          <p className="text-sm text-muted-foreground">Olivia Martin signed a 12-month lease for Apt #304</p>
        </div>
        <div className="ml-auto font-medium text-sm">Today</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Maintenance completed</p>
          <p className="text-sm text-muted-foreground">Jackson Lee fixed the plumbing issue in Apt #201</p>
        </div>
        <div className="ml-auto font-medium text-sm">Yesterday</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Rent payment received</p>
          <p className="text-sm text-muted-foreground">Isabella Nguyen paid $1,500 for Apt #105</p>
        </div>
        <div className="ml-auto font-medium text-sm">2 days ago</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">New maintenance request</p>
          <p className="text-sm text-muted-foreground">William Kim reported a broken AC in Apt #408</p>
        </div>
        <div className="ml-auto font-medium text-sm">3 days ago</div>
      </div>
    </div>
  )
}

