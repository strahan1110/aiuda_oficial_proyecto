import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">About Us</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">Careers</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">Contact</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">Features</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">Pricing</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">API</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">Integrations</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">Documentation</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">Guides</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">Community</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:underline">Support</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subscribe to our newsletter</h3>
            <p className="text-sm text-muted-foreground">Get the latest updates and news.</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Enter your email" className="max-w-xs" />
              <Button type="submit">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
