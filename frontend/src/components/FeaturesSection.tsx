import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

export default function FeaturesSection() {
  const features = [
    {
      title: "Intelligent Chat",
      description: "Experience natural conversations with our AI-powered chatbot that understands context and provides relevant responses.",
      icon: "💬"
    },
    {
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties. We prioritize your privacy and security.",
      icon: "🔒"
    },
    {
      title: "24/7 Availability",
      description: "Get assistance anytime, anywhere. Our AI is always ready to help you with your questions.",
      icon: "🌐"
    },
    {
      title: "Easy to Use",
      description: "Simple and intuitive interface that makes it easy for anyone to start chatting right away.",
      icon: "✨"
    }
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Discover what makes our platform the best choice for your needs.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
