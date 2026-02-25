// Minimal declarations to satisfy the TypeScript Language Server
// without requiring @types/react and @types/node to be fully installed

declare namespace NodeJS {
    interface ProcessEnv {
        [key: string]: string | undefined;
        NAMECHEAP_API_USER?: string;
        NAMECHEAP_API_KEY?: string;
        SERVER_IP?: string;
    }
}

declare var process: {
    env: NodeJS.ProcessEnv;
};

declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}

// Suppress module not found errors for next/navigation and next/server
declare module 'next/navigation' {
    export function notFound(): never;
    export function useRouter(): any;
    export function usePathname(): any;
    export function useSearchParams(): any;
}

declare module 'next/server' {
    export class NextResponse {
        static json(body: any, init?: any): any;
        static redirect(url: string | URL, init?: number | any): any;
        static next(init?: any): any;
    }
}

declare module 'next' {
    export type Metadata = any;
    export namespace MetadataRoute {
        export type Sitemap = any;
        export type Robots = any;
    }
}

declare module 'react' {
    export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
    export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
    export type ReactNode = any;
    export type FormEvent = any;
    export type ChangeEvent<T = any> = any;
}

declare module 'react-dom' {
    export const useFormState: any;
    export const useFormStatus: any;
}
