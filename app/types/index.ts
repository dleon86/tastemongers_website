export interface BlogPost {
  id: number;
  title: string;
  content: string;
  affiliateLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribedAt: Date;
  isSubscribed: boolean;
} 