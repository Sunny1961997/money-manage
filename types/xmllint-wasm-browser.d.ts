declare module "xmllint-wasm/index-browser.mjs" {
  export type XMLString = string

  export interface XMLFileInfo {
    readonly fileName: string
    readonly contents: XMLString | Uint8Array
  }

  export type XMLInput = XMLString | XMLFileInfo

  export interface XMLValidationError {
    readonly rawMessage: string
    readonly message: string
    readonly loc: null | {
      readonly fileName: string
      readonly lineNumber: number
    }
  }

  export interface XMLValidationResult {
    readonly valid: boolean
    readonly errors: ReadonlyArray<XMLValidationError>
    readonly rawOutput: string
    readonly normalized: string
  }

  export interface XMLLintOptions {
    readonly xml: XMLInput | ReadonlyArray<XMLInput>
    readonly schema?: XMLInput | ReadonlyArray<XMLInput>
    readonly preload?: null | undefined | XMLFileInfo | ReadonlyArray<XMLFileInfo>
    readonly extension?: "schema" | "relaxng"
    readonly initialMemoryPages?: number
    readonly maxMemoryPages?: number
    readonly stream?: boolean
    readonly disableFileNameValidation?: boolean
    readonly normalization?: "format" | "c14n"
    readonly modifyArguments?: (args: string[]) => string[]
  }

  export function validateXML(options: XMLLintOptions): Promise<XMLValidationResult>

  export const memoryPages: {
    readonly MiB: number
    readonly GiB: number
    readonly defaultInitialMemoryPages: number
    readonly defaultMaxMemoryPages: number
    readonly max: number
  }
}