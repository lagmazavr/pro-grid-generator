// Fix for Next.js type generation issue
// Maps the incorrectly generated paths to the correct ones

declare module '../../src/app/[locale]/[technology]/page.js' {
  export * from '../../app/[locale]/[technology]/page'
  export { default } from '../../app/[locale]/[technology]/page'
}

declare module '../../src/app/[locale]/page.js' {
  export * from '../../app/[locale]/page'
  export { default } from '../../app/[locale]/page'
}

declare module '../../src/app/page.js' {
  export * from '../../app/page'
  export { default } from '../../app/page'
}

declare module '../../src/app/[locale]/[technology]/layout.js' {
  export * from '../../app/[locale]/[technology]/layout'
  export { default } from '../../app/[locale]/[technology]/layout'
}

declare module '../../src/app/[locale]/layout.js' {
  export * from '../../app/[locale]/layout'
  export { default } from '../../app/[locale]/layout'
}

declare module '../../src/app/layout.js' {
  export * from '../../app/layout'
  export { default } from '../../app/layout'
}
