import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              AI-Powered Assistant for Everyone
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Experience the future of AI conversation. Our advanced assistant helps you with tasks, answers questions, and provides intelligent insights.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <Input
                className="max-w-lg flex-1"
                placeholder="Enter your email"
                type="email"
              />
              <Button type="submit">Get Started</Button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sign up to get started. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
