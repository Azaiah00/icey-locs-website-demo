import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="bg-night-grad py-32">
      <Container className="text-center">
        <p className="kicker text-ice">404</p>
        <h1 className="h-display mt-6 text-[clamp(2.6rem,8vw,5rem)]">This page melted.</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-mist">The link may be old. Everything you need is still a tap away.</p>
        <div className="mt-9 flex justify-center gap-3">
          <Button href="/book" icon="ArrowRight">Book your suite</Button>
          <Button href="/" variant="ghost">Home</Button>
        </div>
      </Container>
    </section>
  );
}
