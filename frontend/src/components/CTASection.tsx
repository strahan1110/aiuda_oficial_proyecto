import { Button } from "./ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

export default function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <Card className="mx-auto max-w-3xl">
          <CardHeader className="space-y-4 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Ready to get started?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of users who are already using our platform to improve their productivity.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button size="lg">Get Started for Free</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
