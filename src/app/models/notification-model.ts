export class Notification{
    id:string
    messageTitle:string
    messageText: string
    recipientId:string
    originatorId:string
    originatorName:string
    ideaId:string
    processed:boolean
    created_on: string
    notifications: Notification
}
