export interface Blogger {
  id: string
  name: string
  bio: string
  image?: string
  socialLinks: {
    platform: string
    url: string
  }[]
}
