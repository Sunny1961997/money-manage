/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["xmllint-wasm"],
  outputFileTracingIncludes: {
    "/api/goaml/validate-xml": ["./node_modules/xmllint-wasm/**/*"],
  },
}

export default nextConfig
