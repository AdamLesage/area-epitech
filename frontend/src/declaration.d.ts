declare module '@iconify/vue' {
    import { DefineComponent } from 'vue';
    const Icon: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
    export { Icon };
}

declare module 'js-cookie' {
    export function set(key: string, value: string, options?: { expires: number }): void;
    export function get(key: string): string | undefined;
    export function remove(key: string): void;
}
