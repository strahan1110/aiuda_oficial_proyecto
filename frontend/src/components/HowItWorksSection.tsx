import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your account in just a few simple steps."
    },
    {
      number: "02",
      title: "Customize",
      description: "Set up your preferences and connect your tools."
    },
    {
      number: "03",
      title: "Start Chatting",
      description: "Begin your conversation with our AI assistant."
    },
    {
      number: "04",
      title: "Get Results",
      description: "Receive accurate and helpful responses instantly."
    }
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Get started in minutes with our simple and intuitive process.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={index} className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {step.number}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle>{step.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
