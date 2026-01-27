export function Themes() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-foreground mb-4 text-balance">
          Dashboard View
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Ready to Elevate Your Compliance Strategy? Let's work together to ensure your business meets and exceeds regulatory obligations.
        </p>
        {/* <div className="grid md:grid-cols-2 gap-8 items-center"> */}
        <div className="w-full rounded-lg overflow-hidden shadow-xl">
          <img
            src="/AML Dashboard Screen 2.png"
            alt="Theme Preview"
            className="w-full h-auto block"
          />
        </div>
        {/* <div className="bg-white rounded-lg h-64 sm:h-80 flex items-center justify-center border border-border">
            <span className="text-muted-foreground text-2xl font-bold">Design Preview</span>
          </div> */}
        {/* </div> */}
      </div>
    </section>
  );
}
